const express = require('express');
const OpenAI = require('openai');
const nodemailer = require('nodemailer');
const { createClient } = require('@supabase/supabase-js');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Initialize services
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );
}

// Configure email transporter (optional)
let emailTransporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  emailTransporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// Generate email content
router.post('/generate-email', authMiddleware, async (req, res) => {
  try {
    const {
      emailType,
      customerName,
      customerCompany,
      customerEmail,
      industry,
      painPoint,
      productInterest
    } = req.body;

    if (!emailType || !customerName || !customerCompany) {
      return res.status(400).json({ 
        error: 'Email type, customer name, and company are required' 
      });
    }

    // Check user credits
    const { data: user } = await supabase
      .from('users')
      .select('credits')
      .eq('id', req.userId)
      .single();

    if (!user || user.credits <= 0) {
      return res.status(403).json({ error: 'Insufficient credits' });
    }

    // Generate email based on type
    let prompt = '';
    
    switch (emailType) {
      case 'cold':
        prompt = `Write a professional cold email for B2B sales. Details:
- Customer: ${customerName} at ${customerCompany}
- Industry: ${industry || 'business'}
- Pain point: ${painPoint || 'operational efficiency'}
- Product interest: ${productInterest || 'AI automation tools'}

The email should:
1. Be personalized and relevant
2. Highlight specific benefits
3. Include social proof
4. Have a clear call-to-action
5. Be concise (under 200 words)

Format as JSON: {"subject": "...", "content": "..."}`;
        break;

      case 'follow-up':
        prompt = `Write a professional follow-up email. Details:
- Customer: ${customerName} at ${customerCompany}
- Industry: ${industry || 'business'}
- Previous discussion about: ${painPoint || 'business challenges'}
- Solution offered: ${productInterest || 'AI automation'}

The email should:
1. Reference previous conversation
2. Provide additional value
3. Include a case study or testimonial
4. Suggest next steps
5. Be respectful of their time

Format as JSON: {"subject": "...", "content": "..."}`;
        break;

      case 'proposal':
        prompt = `Write a professional proposal email. Details:
- Customer: ${customerName} at ${customerCompany}
- Industry: ${industry || 'business'}
- Challenge to solve: ${painPoint || 'operational efficiency'}
- Proposed solution: ${productInterest || 'AI automation platform'}

The email should:
1. Summarize their needs
2. Present a structured solution
3. Include timeline and phases
4. Mention expected outcomes
5. Include pricing framework

Format as JSON: {"subject": "...", "content": "..."}`;
        break;

      default:
        return res.status(400).json({ error: 'Invalid email type' });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert sales copywriter. Write compelling, professional B2B emails that convert prospects into customers."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 800,
      temperature: 0.7
    });

    const response = completion.choices[0].message.content;
    let aiResult;

    try {
      aiResult = JSON.parse(response);
    } catch (parseError) {
      // Fallback if JSON parsing fails
      aiResult = {
        subject: `Partnership Opportunity - ${customerCompany}`,
        content: response
      };
    }

    // Save email template to database
    const { data: savedEmail, error: saveError } = await supabase
      .from('email_templates')
      .insert([
        {
          user_id: req.userId,
          email_type: emailType,
          customer_name: customerName,
          customer_company: customerCompany,
          customer_email: customerEmail,
          subject: aiResult.subject,
          content: aiResult.content,
          industry,
          pain_point: painPoint,
          product_interest: productInterest,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (saveError) {
      console.error('Database save error:', saveError);
      return res.status(500).json({ error: 'Failed to save email template' });
    }

    // Deduct credit
    await supabase
      .from('users')
      .update({ credits: user.credits - 1 })
      .eq('id', req.userId);

    res.json({
      message: 'Email generated successfully',
      email: {
        id: savedEmail.id,
        type: savedEmail.email_type,
        subject: savedEmail.subject,
        content: savedEmail.content,
        createdAt: savedEmail.created_at
      },
      creditsRemaining: user.credits - 1
    });

  } catch (error) {
    console.error('Email generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate email',
      message: error.message 
    });
  }
});

// Send email
router.post('/send-email', authMiddleware, async (req, res) => {
  try {
    const { emailId, recipientEmail, senderName, senderEmail } = req.body;

    if (!emailId || !recipientEmail) {
      return res.status(400).json({ 
        error: 'Email ID and recipient email are required' 
      });
    }

    // Get email template
    const { data: emailTemplate, error: fetchError } = await supabase
      .from('email_templates')
      .select('*')
      .eq('id', emailId)
      .eq('user_id', req.userId)
      .single();

    if (fetchError || !emailTemplate) {
      return res.status(404).json({ error: 'Email template not found' });
    }

    // Send email
    const mailOptions = {
      from: `${senderName || 'Sales Team'} <${senderEmail || process.env.SMTP_USER}>`,
      to: recipientEmail,
      subject: emailTemplate.subject,
      text: emailTemplate.content,
      html: emailTemplate.content.replace(/\n/g, '<br>')
    };

    await emailTransporter.sendMail(mailOptions);

    // Log sent email
    await supabase
      .from('sent_emails')
      .insert([
        {
          user_id: req.userId,
          email_template_id: emailId,
          recipient_email: recipientEmail,
          sender_name: senderName,
          sender_email: senderEmail,
          subject: emailTemplate.subject,
          content: emailTemplate.content,
          sent_at: new Date().toISOString()
        }
      ]);

    res.json({
      message: 'Email sent successfully',
      sentTo: recipientEmail,
      sentAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ 
      error: 'Failed to send email',
      message: error.message 
    });
  }
});

// Get email templates
router.get('/templates', authMiddleware, async (req, res) => {
  try {
    const { type } = req.query;
    
    let query = supabase
      .from('email_templates')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });

    if (type) {
      query = query.eq('email_type', type);
    }

    const { data: templates, error } = await query;

    if (error) {
      console.error('Database query error:', error);
      return res.status(500).json({ error: 'Failed to fetch templates' });
    }

    res.json({
      templates: templates.map(template => ({
        id: template.id,
        type: template.email_type,
        subject: template.subject,
        content: template.content,
        customerName: template.customer_name,
        customerCompany: template.customer_company,
        createdAt: template.created_at
      }))
    });
  } catch (error) {
    console.error('Template fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get sent emails
router.get('/sent', authMiddleware, async (req, res) => {
  try {
    const { data: sentEmails, error } = await supabase
      .from('sent_emails')
      .select(`
        *,
        email_templates (
          customer_name,
          customer_company,
          email_type
        )
      `)
      .eq('user_id', req.userId)
      .order('sent_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Database query error:', error);
      return res.status(500).json({ error: 'Failed to fetch sent emails' });
    }

    res.json({
      sentEmails: sentEmails.map(email => ({
        id: email.id,
        recipientEmail: email.recipient_email,
        subject: email.subject,
        customerName: email.email_templates?.customer_name,
        customerCompany: email.email_templates?.customer_company,
        emailType: email.email_templates?.email_type,
        sentAt: email.sent_at
      }))
    });
  } catch (error) {
    console.error('Sent emails fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update email template
router.put('/templates/:id', authMiddleware, async (req, res) => {
  try {
    const { subject, content } = req.body;
    const templateId = req.params.id;

    const { data: updatedTemplate, error } = await supabase
      .from('email_templates')
      .update({
        subject,
        content,
        updated_at: new Date().toISOString()
      })
      .eq('id', templateId)
      .eq('user_id', req.userId)
      .select()
      .single();

    if (error || !updatedTemplate) {
      return res.status(404).json({ error: 'Template not found or unauthorized' });
    }

    res.json({
      message: 'Template updated successfully',
      template: {
        id: updatedTemplate.id,
        type: updatedTemplate.email_type,
        subject: updatedTemplate.subject,
        content: updatedTemplate.content,
        createdAt: updatedTemplate.created_at
      }
    });
  } catch (error) {
    console.error('Template update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete email template
router.delete('/templates/:id', authMiddleware, async (req, res) => {
  try {
    const templateId = req.params.id;

    const { error } = await supabase
      .from('email_templates')
      .delete()
      .eq('id', templateId)
      .eq('user_id', req.userId);

    if (error) {
      console.error('Template delete error:', error);
      return res.status(500).json({ error: 'Failed to delete template' });
    }

    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Template delete error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;