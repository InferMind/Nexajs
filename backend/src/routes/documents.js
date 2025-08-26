const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
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

// Upload and process document
router.post('/upload', authMiddleware, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Check user credits (if using real database)
    if (supabase) {
      const { data: user } = await supabase
        .from('users')
        .select('credits')
        .eq('id', req.userId)
        .single();

      if (!user || user.credits <= 0) {
        return res.status(403).json({ error: 'Insufficient credits' });
      }
    }

    // Extract text from file
    const text = await extractTextFromFile(req.file);
    
    if (!text || text.trim().length < 100) {
      return res.status(400).json({ error: 'Document appears to be empty or too short' });
    }

    // Generate summary using AI (if OpenAI key is available)
    let aiResult;
    if (openai) {
      aiResult = await generateSummary(text, req.file.originalname);
    } else {
      // Mock response for development
      aiResult = {
        summary: `This is a mock summary of ${req.file.originalname}. The document contains ${text.length} characters of content.`,
        keyPoints: [
          'Document successfully processed',
          'Text extraction completed',
          'Mock analysis generated',
          'Ready for review'
        ],
        actionItems: [
          'Review the document content',
          'Share with team members',
          'Follow up on key points'
        ]
      };
    }

    // Create document record
    const documentData = {
      id: Date.now().toString(),
      title: req.file.originalname,
      content: aiResult.summary,
      keyPoints: aiResult.keyPoints,
      actionItems: aiResult.actionItems,
      createdAt: new Date().toISOString(),
      fileType: req.file.mimetype.split('/')[1].toUpperCase(),
      fileSize: Math.round(req.file.size / 1024), // KB
      status: 'completed'
    };

    // Save to database if available
    if (supabase) {
      const { data: summary, error: saveError } = await supabase
        .from('documents')
        .insert([
          {
            user_id: req.userId,
            title: req.file.originalname,
            content: text.substring(0, 5000), // Store first 5000 chars
            summary: aiResult.summary,
            key_points: aiResult.keyPoints,
            action_items: aiResult.actionItems,
            file_type: req.file.mimetype,
            file_size: req.file.size,
            status: 'completed',
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (saveError) {
        console.error('Database save error:', saveError);
        return res.status(500).json({ error: 'Failed to save document' });
      }

      // Deduct credit
      await supabase
        .from('users')
        .update({ credits: user.credits - 1 })
        .eq('id', req.userId);

      documentData.id = summary.id;
    }

    res.json(documentData);

  } catch (error) {
    console.error('Document processing error:', error);
    res.status(500).json({ 
      error: 'Failed to process document',
      message: error.message 
    });
  }
});

// Get user's documents
router.get('/', authMiddleware, async (req, res) => {
  try {
    let documents = [];

    if (supabase) {
      const { data: docs, error } = await supabase
        .from('documents')
        .select('id, title, summary, key_points, action_items, file_type, file_size, status, created_at')
        .eq('user_id', req.userId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Database query error:', error);
        return res.status(500).json({ error: 'Failed to fetch documents' });
      }

      documents = docs.map(doc => ({
        id: doc.id,
        title: doc.title,
        content: doc.summary,
        keyPoints: doc.key_points,
        actionItems: doc.action_items,
        fileType: doc.file_type,
        fileSize: doc.file_size,
        status: doc.status,
        createdAt: doc.created_at
      }));
    } else {
      // Mock data for development
      documents = [
        {
          id: '1',
          title: 'Sample Document.pdf',
          content: 'This is a sample document summary for development purposes.',
          keyPoints: ['Sample key point 1', 'Sample key point 2'],
          actionItems: ['Sample action item 1', 'Sample action item 2'],
          fileType: 'PDF',
          fileSize: 1024,
          status: 'completed',
          createdAt: new Date().toISOString()
        }
      ];
    }

    res.json(documents);
  } catch (error) {
    console.error('Documents fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific document
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    if (supabase) {
      const { data: document, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', req.params.id)
        .eq('user_id', req.userId)
        .single();

      if (error || !document) {
        return res.status(404).json({ error: 'Document not found' });
      }

      res.json({
        id: document.id,
        title: document.title,
        content: document.summary,
        keyPoints: document.key_points,
        actionItems: document.action_items,
        fileType: document.file_type,
        fileSize: document.file_size,
        status: document.status,
        createdAt: document.created_at
      });
    } else {
      // Mock response for development
      res.json({
        id: req.params.id,
        title: 'Sample Document.pdf',
        content: 'This is a sample document summary for development purposes.',
        keyPoints: ['Sample key point 1', 'Sample key point 2'],
        actionItems: ['Sample action item 1', 'Sample action item 2'],
        fileType: 'PDF',
        fileSize: 1024,
        status: 'completed',
        createdAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Document fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete document
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (supabase) {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', req.params.id)
        .eq('user_id', req.userId);

      if (error) {
        console.error('Database delete error:', error);
        return res.status(500).json({ error: 'Failed to delete document' });
      }
    }

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Document delete error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;