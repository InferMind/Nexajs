const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();

// Initialize Supabase client (optional for development)
let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );
}

// In-memory user storage for development (when no database is available)
const mockUsers = new Map();

// Register endpoint
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().isLength({ min: 1 }),
  body('company').optional().trim(),
  body('plan').isIn(['free', 'pro', 'business'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name, company, plan } = req.body;

    let user;

    if (supabase) {
      // Use Supabase database
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user in Supabase
      const { data: newUser, error } = await supabase
        .from('users')
        .insert([
          {
            email,
            password_hash: hashedPassword,
            name,
            company,
            plan,
            credits: plan === 'free' ? 5 : plan === 'pro' ? 500 : 999999,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ error: 'Failed to create user' });
      }

      user = newUser;
    } else {
      // Use mock storage for development
      if (mockUsers.has(email)) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create mock user
      user = {
        id: Date.now().toString(),
        email,
        password: hashedPassword,
        name,
        company,
        plan,
        credits: plan === 'free' ? 5 : plan === 'pro' ? 500 : 999999,
        created_at: new Date().toISOString()
      };

      mockUsers.set(email, user);
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        company: user.company,
        plan: user.plan,
        credits: user.credits
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    let user;

    if (supabase) {
      // Find user in Supabase
      const { data: foundUser, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !foundUser) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      user = foundUser;
    } else {
      // Find user in mock storage
      user = mockUsers.get(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash || user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        company: user.company,
        plan: user.plan,
        credits: user.credits
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user profile (Supabase or JWT via middleware)
router.get('/profile', require('../middleware/auth'), async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Supabase not configured' });
    }

    // Ensure user exists in our users table; create if missing
    const { data: foundUser } = await supabase
      .from('users')
      .select('id, email, name, company, plan, credits, created_at')
      .eq('id', req.userId)
      .single();

    let user = foundUser;

    if (!user) {
      const { data: created, error: insertError } = await supabase
        .from('users')
        .insert([
          {
            id: req.userId,
            email: req.userEmail,
            name: req.userEmail?.split('@')[0] || 'User',
            plan: 'free',
            credits: 5,
            created_at: new Date().toISOString(),
          },
        ])
        .select('id, email, name, company, plan, credits, created_at')
        .single();
      if (insertError) {
        console.error('User bootstrap error:', insertError);
        return res.status(500).json({ error: 'Failed to bootstrap user profile' });
      }
      user = created;
    }

    res.json({ user });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;