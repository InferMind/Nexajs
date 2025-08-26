const { createClient } = require('@supabase/supabase-js');

class CreditService {
  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
  }

  async getUserCredits(userId) {
    try {
      const { data: user, error } = await this.supabase
        .from('users')
        .select('credits, plan')
        .eq('id', userId)
        .single();

      if (error || !user) {
        throw new Error('User not found');
      }

      return {
        credits: user.credits,
        plan: user.plan
      };
    } catch (error) {
      console.error('Get user credits error:', error);
      throw error;
    }
  }

  async checkCredits(userId, requiredCredits = 1) {
    try {
      const userCredits = await this.getUserCredits(userId);
      
      return {
        hasCredits: userCredits.credits >= requiredCredits,
        currentCredits: userCredits.credits,
        requiredCredits,
        plan: userCredits.plan
      };
    } catch (error) {
      console.error('Check credits error:', error);
      throw error;
    }
  }

  async deductCredits(userId, module, action, creditsToDeduct = 1) {
    try {
      // Start a transaction-like operation
      const { data: user, error: fetchError } = await this.supabase
        .from('users')
        .select('credits')
        .eq('id', userId)
        .single();

      if (fetchError || !user) {
        throw new Error('User not found');
      }

      if (user.credits < creditsToDeduct) {
        throw new Error('Insufficient credits');
      }

      // Update user credits
      const { error: updateError } = await this.supabase
        .from('users')
        .update({ credits: user.credits - creditsToDeduct })
        .eq('id', userId);

      if (updateError) {
        throw new Error('Failed to update credits');
      }

      // Log credit usage
      const { error: logError } = await this.supabase
        .from('credit_usage')
        .insert([
          {
            user_id: userId,
            module,
            action,
            credits_used: creditsToDeduct,
            created_at: new Date().toISOString()
          }
        ]);

      if (logError) {
        console.warn('Failed to log credit usage:', logError);
        // Don't throw error for logging failure
      }

      return {
        success: true,
        remainingCredits: user.credits - creditsToDeduct,
        creditsDeducted: creditsToDeduct
      };
    } catch (error) {
      console.error('Deduct credits error:', error);
      throw error;
    }
  }

  async addCredits(userId, creditsToAdd, reason = 'manual_addition') {
    try {
      const { data: user, error: fetchError } = await this.supabase
        .from('users')
        .select('credits')
        .eq('id', userId)
        .single();

      if (fetchError || !user) {
        throw new Error('User not found');
      }

      const newCredits = user.credits + creditsToAdd;

      const { error: updateError } = await this.supabase
        .from('users')
        .update({ credits: newCredits })
        .eq('id', userId);

      if (updateError) {
        throw new Error('Failed to add credits');
      }

      // Log credit addition
      const { error: logError } = await this.supabase
        .from('credit_usage')
        .insert([
          {
            user_id: userId,
            module: 'system',
            action: reason,
            credits_used: -creditsToAdd, // Negative for additions
            created_at: new Date().toISOString()
          }
        ]);

      if (logError) {
        console.warn('Failed to log credit addition:', logError);
      }

      return {
        success: true,
        newBalance: newCredits,
        creditsAdded: creditsToAdd
      };
    } catch (error) {
      console.error('Add credits error:', error);
      throw error;
    }
  }

  async getCreditUsageStats(userId, days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data: usage, error } = await this.supabase
        .from('credit_usage')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error('Failed to fetch usage stats');
      }

      // Calculate stats
      const stats = {
        totalUsed: 0,
        byModule: {
          summarizer: 0,
          support: 0,
          sales: 0
        },
        byDay: {},
        recentUsage: usage.slice(0, 10)
      };

      usage.forEach(record => {
        if (record.credits_used > 0) { // Only count deductions, not additions
          stats.totalUsed += record.credits_used;
          
          if (stats.byModule[record.module] !== undefined) {
            stats.byModule[record.module] += record.credits_used;
          }

          const date = record.created_at.split('T')[0];
          if (!stats.byDay[date]) {
            stats.byDay[date] = 0;
          }
          stats.byDay[date] += record.credits_used;
        }
      });

      return stats;
    } catch (error) {
      console.error('Get usage stats error:', error);
      throw error;
    }
  }

  async resetUserCredits(userId, newCredits, plan) {
    try {
      const { error } = await this.supabase
        .from('users')
        .update({ 
          credits: newCredits,
          plan: plan
        })
        .eq('id', userId);

      if (error) {
        throw new Error('Failed to reset credits');
      }

      // Log the reset
      await this.supabase
        .from('credit_usage')
        .insert([
          {
            user_id: userId,
            module: 'system',
            action: `plan_change_to_${plan}`,
            credits_used: -newCredits, // Negative for credit grants
            created_at: new Date().toISOString()
          }
        ]);

      return {
        success: true,
        newCredits,
        plan
      };
    } catch (error) {
      console.error('Reset credits error:', error);
      throw error;
    }
  }

  // Get credit costs for different operations
  getCreditCosts() {
    return {
      summarizer: {
        summarize: 1
      },
      support: {
        generateFaqs: 1,
        chat: 0 // Free for now
      },
      sales: {
        generateEmail: 1,
        sendEmail: 0 // Free for now
      }
    };
  }

  // Check if user has enough credits for a specific operation
  async canPerformOperation(userId, module, operation) {
    try {
      const costs = this.getCreditCosts();
      const requiredCredits = costs[module]?.[operation] || 1;
      
      const creditCheck = await this.checkCredits(userId, requiredCredits);
      
      return {
        canPerform: creditCheck.hasCredits,
        requiredCredits,
        currentCredits: creditCheck.currentCredits,
        plan: creditCheck.plan
      };
    } catch (error) {
      console.error('Can perform operation error:', error);
      throw error;
    }
  }
}

module.exports = new CreditService();