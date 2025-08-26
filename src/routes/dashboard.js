const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Initialize Supabase client (optional for development)
let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );
}

// Get dashboard statistics
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    let stats;

    if (supabase) {
      // Get real stats from database
      const { data: documents } = await supabase
        .from('documents')
        .select('id, created_at')
        .eq('user_id', req.userId);

      const { data: supportQueries } = await supabase
        .from('support_queries')
        .select('id, created_at')
        .eq('user_id', req.userId);

      const { data: salesEmails } = await supabase
        .from('sales_emails')
        .select('id, created_at')
        .eq('user_id', req.userId);

      const { data: user } = await supabase
        .from('users')
        .select('credits')
        .eq('id', req.userId)
        .single();

      stats = [
        {
          title: 'Documents Processed',
          value: documents?.length || 0,
          total: 100,
          change: '+12%',
          trend: 'up',
          icon: 'FileText',
          color: 'from-blue-500 to-cyan-500',
          bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50',
          textColor: 'text-blue-600'
        },
        {
          title: 'Support Queries',
          value: supportQueries?.length || 0,
          total: 50,
          change: '+8%',
          trend: 'up',
          icon: 'MessageSquare',
          color: 'from-purple-500 to-pink-500',
          bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
          textColor: 'text-purple-600'
        },
        {
          title: 'Sales Emails',
          value: salesEmails?.length || 0,
          total: 75,
          change: '+23%',
          trend: 'up',
          icon: 'Mail',
          color: 'from-green-500 to-emerald-500',
          bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
          textColor: 'text-green-600'
        },
        {
          title: 'Credits Remaining',
          value: user?.credits || 0,
          total: 500,
          change: '-5',
          trend: 'down',
          icon: 'Zap',
          color: 'from-yellow-500 to-orange-500',
          bgColor: 'bg-gradient-to-br from-yellow-50 to-orange-50',
          textColor: 'text-yellow-600'
        }
      ];
    } else {
      // Mock stats for development
      stats = [
        {
          title: 'Documents Processed',
          value: 23,
          total: 100,
          change: '+12%',
          trend: 'up',
          icon: 'FileText',
          color: 'from-blue-500 to-cyan-500',
          bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50',
          textColor: 'text-blue-600'
        },
        {
          title: 'Support Queries',
          value: 12,
          total: 50,
          change: '+8%',
          trend: 'up',
          icon: 'MessageSquare',
          color: 'from-purple-500 to-pink-500',
          bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
          textColor: 'text-purple-600'
        },
        {
          title: 'Sales Emails',
          value: 34,
          total: 75,
          change: '+23%',
          trend: 'up',
          icon: 'Mail',
          color: 'from-green-500 to-emerald-500',
          bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
          textColor: 'text-green-600'
        },
        {
          title: 'Credits Remaining',
          value: 453,
          total: 500,
          change: '-5',
          trend: 'down',
          icon: 'Zap',
          color: 'from-yellow-500 to-orange-500',
          bgColor: 'bg-gradient-to-br from-yellow-50 to-orange-50',
          textColor: 'text-yellow-600'
        }
      ];
    }

    res.json({ stats });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;