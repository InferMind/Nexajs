const express = require('express');
const OpenAI = require('openai');
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

// Generate FAQs from knowledge base
router.post('/generate-faqs', authMiddleware, async (req, res) => {
  try {
    const { documents, category = 'General' } = req.body;

    if (!documents || documents.length === 0) {
      return res.status(400).json({ error: 'No documents provided' });
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

    // Combine documents for context
    const combinedText = documents.join('\n\n');

    const prompt = `Based on the following documentation, generate 5-8 frequently asked questions and their comprehensive answers. Focus on common customer concerns and practical information.

Documentation:
${combinedText.substring(0, 3000)}

Please format your response as JSON with the following structure:
{
  "faqs": [
    {
      "question": "...",
      "answer": "...",
      "category": "${category}"
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a customer support expert. Generate helpful FAQs that address common customer questions based on the provided documentation."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.3
    });

    const response = completion.choices[0].message.content;
    let aiResult;

    try {
      aiResult = JSON.parse(response);
    } catch (parseError) {
      // Fallback if JSON parsing fails
      aiResult = {
        faqs: [
          {
            question: "How can I get help with your product?",
            answer: "You can contact our support team through the chat widget or email us directly. We're here to help!",
            category: category
          }
        ]
      };
    }

    // Save FAQs to database
    const faqInserts = aiResult.faqs.map(faq => ({
      user_id: req.userId,
      question: faq.question,
      answer: faq.answer,
      category: faq.category || category,
      created_at: new Date().toISOString()
    }));

    const { data: savedFaqs, error: saveError } = await supabase
      .from('faqs')
      .insert(faqInserts)
      .select();

    if (saveError) {
      console.error('Database save error:', saveError);
      return res.status(500).json({ error: 'Failed to save FAQs' });
    }

    // Deduct credit
    await supabase
      .from('users')
      .update({ credits: user.credits - 1 })
      .eq('id', req.userId);

    res.json({
      message: 'FAQs generated successfully',
      faqs: savedFaqs.map(faq => ({
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        createdAt: faq.created_at
      })),
      creditsRemaining: user.credits - 1
    });

  } catch (error) {
    console.error('FAQ generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate FAQs',
      message: error.message 
    });
  }
});

// Get user's FAQs
router.get('/faqs', authMiddleware, async (req, res) => {
  try {
    const { category } = req.query;
    
    let query = supabase
      .from('faqs')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    const { data: faqs, error } = await query;

    if (error) {
      console.error('Database query error:', error);
      return res.status(500).json({ error: 'Failed to fetch FAQs' });
    }

    res.json({
      faqs: faqs.map(faq => ({
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        createdAt: faq.created_at
      }))
    });
  } catch (error) {
    console.error('FAQ fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Chat with AI assistant
router.post('/chat', authMiddleware, async (req, res) => {
  try {
    const { message, conversationId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get user's FAQs for context
    const { data: faqs } = await supabase
      .from('faqs')
      .select('question, answer')
      .eq('user_id', req.userId)
      .limit(10);

    // Build context from FAQs
    const faqContext = faqs?.map(faq => `Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n') || '';

    const prompt = `You are a helpful customer support assistant. Use the following FAQ knowledge base to answer customer questions. If the answer isn't in the knowledge base, provide a helpful general response and suggest contacting support.

Knowledge Base:
${faqContext}

Customer Question: ${message}

Please provide a helpful, professional response.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a professional customer support assistant. Be helpful, concise, and friendly."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    const aiResponse = completion.choices[0].message.content;

    // Save conversation to database
    const { data: conversation, error: saveError } = await supabase
      .from('support_conversations')
      .insert([
        {
          user_id: req.userId,
          conversation_id: conversationId || `conv_${Date.now()}`,
          user_message: message,
          ai_response: aiResponse,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (saveError) {
      console.error('Conversation save error:', saveError);
    }

    res.json({
      response: aiResponse,
      conversationId: conversation?.conversation_id || conversationId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Failed to process chat message',
      message: error.message 
    });
  }
});

// Get chat history
router.get('/conversations', authMiddleware, async (req, res) => {
  try {
    const { data: conversations, error } = await supabase
      .from('support_conversations')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Database query error:', error);
      return res.status(500).json({ error: 'Failed to fetch conversations' });
    }

    res.json({
      conversations: conversations.map(conv => ({
        id: conv.id,
        conversationId: conv.conversation_id,
        userMessage: conv.user_message,
        aiResponse: conv.ai_response,
        createdAt: conv.created_at
      }))
    });
  } catch (error) {
    console.error('Conversation fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update FAQ
router.put('/faqs/:id', authMiddleware, async (req, res) => {
  try {
    const { question, answer, category } = req.body;
    const faqId = req.params.id;

    const { data: updatedFaq, error } = await supabase
      .from('faqs')
      .update({
        question,
        answer,
        category,
        updated_at: new Date().toISOString()
      })
      .eq('id', faqId)
      .eq('user_id', req.userId)
      .select()
      .single();

    if (error || !updatedFaq) {
      return res.status(404).json({ error: 'FAQ not found or unauthorized' });
    }

    res.json({
      message: 'FAQ updated successfully',
      faq: {
        id: updatedFaq.id,
        question: updatedFaq.question,
        answer: updatedFaq.answer,
        category: updatedFaq.category,
        createdAt: updatedFaq.created_at
      }
    });
  } catch (error) {
    console.error('FAQ update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete FAQ
router.delete('/faqs/:id', authMiddleware, async (req, res) => {
  try {
    const faqId = req.params.id;

    const { error } = await supabase
      .from('faqs')
      .delete()
      .eq('id', faqId)
      .eq('user_id', req.userId);

    if (error) {
      console.error('FAQ delete error:', error);
      return res.status(500).json({ error: 'Failed to delete FAQ' });
    }

    res.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    console.error('FAQ delete error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;