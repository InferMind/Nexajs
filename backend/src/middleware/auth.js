const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

// Optional Supabase client for token verification
let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    // 1) Try local JWT
    if (process.env.JWT_SECRET) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        req.userEmail = decoded.email;
        return next();
      } catch (_) {
        // fall through to Supabase verification
      }
    }

    // 2) Try Supabase Auth verification
    if (supabase) {
      const { data, error } = await supabase.auth.getUser(token);
      if (error || !data?.user) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }
      req.userId = data.user.id;
      req.userEmail = data.user.email;
      return next();
    }

    return res.status(401).json({ error: 'Invalid or expired token' });
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;