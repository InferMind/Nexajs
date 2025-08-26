const express = require('express');
const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Initialize services
let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );
}

// Get user's billing information
router.get('/info', authMiddleware, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, plan, credits, stripe_customer_id, subscription_status, subscription_end_date')
      .eq('id', req.userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get usage statistics
    const { data: usage } = await supabase
      .from('credit_usage')
      .select('*')
      .eq('user_id', req.userId)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });

    const usageStats = {
      totalUsed: usage?.length || 0,
      summarizerUsed: usage?.filter(u => u.module === 'summarizer').length || 0,
      supportUsed: usage?.filter(u => u.module === 'support').length || 0,
      salesUsed: usage?.filter(u => u.module === 'sales').length || 0
    };

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
        credits: user.credits,
        subscriptionStatus: user.subscription_status,
        subscriptionEndDate: user.subscription_end_date
      },
      usage: usageStats
    });
  } catch (error) {
    console.error('Billing info error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create Stripe checkout session
router.post('/create-checkout-session', authMiddleware, async (req, res) => {
  try {
    const { plan } = req.body;

    if (!['pro', 'business'].includes(plan)) {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }

    // Get user info
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('email, name, stripe_customer_id')
      .eq('id', req.userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create or get Stripe customer
    let customerId = user.stripe_customer_id;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: req.userId
        }
      });
      customerId = customer.id;

      // Update user with Stripe customer ID
      await supabase
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', req.userId);
    }

    // Define price IDs (these would be created in Stripe dashboard)
    const priceIds = {
      pro: process.env.STRIPE_PRO_PRICE_ID || 'price_pro_monthly',
      business: process.env.STRIPE_BUSINESS_PRICE_ID || 'price_business_monthly'
    };

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceIds[plan],
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/dashboard/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/dashboard/billing?canceled=true`,
      metadata: {
        userId: req.userId,
        plan: plan
      }
    });

    res.json({
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    console.error('Checkout session error:', error);
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      message: error.message 
    });
  }
});

// Handle Stripe webhooks
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        await handleSuccessfulPayment(session);
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        await handleSuccessfulPayment(invoice);
        break;

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscription = event.data.object;
        await handleSubscriptionChange(subscription);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handling error:', error);
    res.status(500).json({ error: 'Webhook handling failed' });
  }
});

// Handle successful payment
async function handleSuccessfulPayment(session) {
  try {
    const userId = session.metadata?.userId;
    if (!userId) return;

    const plan = session.metadata?.plan || 'pro';
    const credits = plan === 'pro' ? 500 : 999999; // Business gets "unlimited"

    // Update user subscription
    await supabase
      .from('users')
      .update({
        plan: plan,
        credits: credits,
        subscription_status: 'active',
        subscription_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
      })
      .eq('id', userId);

    console.log(`Payment successful for user ${userId}, plan: ${plan}`);
  } catch (error) {
    console.error('Payment handling error:', error);
  }
}

// Handle subscription changes
async function handleSubscriptionChange(subscription) {
  try {
    const customerId = subscription.customer;
    
    // Find user by Stripe customer ID
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single();

    if (!user) return;

    const status = subscription.status;
    const endDate = new Date(subscription.current_period_end * 1000).toISOString();

    let updateData = {
      subscription_status: status,
      subscription_end_date: endDate
    };

    // If subscription is canceled or past due, revert to free plan
    if (['canceled', 'past_due', 'unpaid'].includes(status)) {
      updateData.plan = 'free';
      updateData.credits = 5;
    }

    await supabase
      .from('users')
      .update(updateData)
      .eq('id', user.id);

    console.log(`Subscription updated for user ${user.id}, status: ${status}`);
  } catch (error) {
    console.error('Subscription change handling error:', error);
  }
}

// Cancel subscription
router.post('/cancel-subscription', authMiddleware, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', req.userId)
      .single();

    if (error || !user?.stripe_customer_id) {
      return res.status(404).json({ error: 'No active subscription found' });
    }

    // Get active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripe_customer_id,
      status: 'active'
    });

    if (subscriptions.data.length === 0) {
      return res.status(404).json({ error: 'No active subscription found' });
    }

    // Cancel the subscription at period end
    const subscription = subscriptions.data[0];
    await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: true
    });

    res.json({
      message: 'Subscription will be canceled at the end of the current billing period',
      cancelAt: new Date(subscription.current_period_end * 1000).toISOString()
    });

  } catch (error) {
    console.error('Subscription cancellation error:', error);
    res.status(500).json({ 
      error: 'Failed to cancel subscription',
      message: error.message 
    });
  }
});

// Get usage history
router.get('/usage', authMiddleware, async (req, res) => {
  try {
    const { data: usage, error } = await supabase
      .from('credit_usage')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Usage fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch usage data' });
    }

    // Group usage by date and module
    const usageByDate = usage.reduce((acc, record) => {
      const date = record.created_at.split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, summarizer: 0, support: 0, sales: 0, total: 0 };
      }
      acc[date][record.module]++;
      acc[date].total++;
      return acc;
    }, {});

    res.json({
      usage: Object.values(usageByDate).reverse(),
      totalCreditsUsed: usage.length
    });
  } catch (error) {
    console.error('Usage history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;