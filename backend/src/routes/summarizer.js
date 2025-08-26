const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const OpenAI = require('openai');
const { createClient } = require('@supabase/supabase-js');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Initialize services
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/markdown'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, TXT, and MD files are allowed.'));
    }
  }
});

// Extract text from different file types
async function extractTextFromFile(file) {
  const { buffer, mimetype } = file;
  
  try {
    switch (mimetype) {
      case 'application/pdf':
        const pdfData = await pdfParse(buffer);
        return pdfData.text;
      
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        const docData = await mammoth.extractRawText({ buffer });
        return docData.value;
      
      case 'text/plain':
      case 'text/markdown':
        return buffer.toString('utf-8');
      
      default:
        throw new Error('Unsupported file type');
    }
  } catch (error) {
    console.error('Text extraction error:', error);
    throw new Error('Failed to extract text from file');
  }
}

// Generate summary using OpenAI
async function generateSummary(text, filename) {
  try {
    const prompt = `Please analyze the following document and provide:

1. A comprehensive summary (2-3 paragraphs)
2. Key points (5-7 bullet points)
3. Action items (3-5 specific actionable tasks)

Document: "${filename}"
Content: ${text.substring(0, 4000)}...

Please format your response as JSON with the following structure:
{
  "summary": "...",
  "keyPoints": ["...", "..."],
  "actionItems": ["...", "..."]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert document analyzer. Provide clear, concise summaries and actionable insights from business documents."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.3
    });

    const response = completion.choices[0].message.content;
    
    // Try to parse JSON response
    try {
      return JSON.parse(response);
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return {
        summary: response,
        keyPoints: ["Analysis completed - see summary for details"],
        actionItems: ["Review the generated summary", "Share with relevant team members"]
      };
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate summary');
  }
}

// Summarize document endpoint
router.post('/summarize', authMiddleware, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
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

    // Extract text from file
    const text = await extractTextFromFile(req.file);
    
    if (!text || text.trim().length < 100) {
      return res.status(400).json({ error: 'Document appears to be empty or too short' });
    }

    // Generate summary using AI
    const aiResult = await generateSummary(text, req.file.originalname);

    // Save summary to database
    const { data: summary, error: saveError } = await supabase
      .from('summaries')
      .insert([
        {
          user_id: req.userId,
          title: req.file.originalname,
          original_text: text.substring(0, 5000), // Store first 5000 chars
          summary: aiResult.summary,
          key_points: aiResult.keyPoints,
          action_items: aiResult.actionItems,
          file_type: req.file.mimetype,
          file_size: req.file.size,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (saveError) {
      console.error('Database save error:', saveError);
      return res.status(500).json({ error: 'Failed to save summary' });
    }

    // Deduct credit
    await supabase
      .from('users')
      .update({ credits: user.credits - 1 })
      .eq('id', req.userId);

    res.json({
      message: 'Document summarized successfully',
      summary: {
        id: summary.id,
        title: summary.title,
        content: summary.summary,
        keyPoints: summary.key_points,
        actionItems: summary.action_items,
        createdAt: summary.created_at
      },
      creditsRemaining: user.credits - 1
    });

  } catch (error) {
    console.error('Summarization error:', error);
    res.status(500).json({ 
      error: 'Failed to process document',
      message: error.message 
    });
  }
});

// Get user's summaries
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const { data: summaries, error } = await supabase
      .from('summaries')
      .select('id, title, summary, key_points, action_items, created_at')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Database query error:', error);
      return res.status(500).json({ error: 'Failed to fetch summaries' });
    }

    res.json({
      summaries: summaries.map(s => ({
        id: s.id,
        title: s.title,
        content: s.summary,
        keyPoints: s.key_points,
        actionItems: s.action_items,
        createdAt: s.created_at
      }))
    });
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific summary
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { data: summary, error } = await supabase
      .from('summaries')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .single();

    if (error || !summary) {
      return res.status(404).json({ error: 'Summary not found' });
    }

    res.json({
      summary: {
        id: summary.id,
        title: summary.title,
        content: summary.summary,
        keyPoints: summary.key_points,
        actionItems: summary.action_items,
        createdAt: summary.created_at
      }
    });
  } catch (error) {
    console.error('Summary fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;