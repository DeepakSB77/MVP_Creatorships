import { supabase } from '@/lib/supabase'

interface EmailView {
  id: string;
  email_viewed: string;
  viewed_at: string;
}


export const emailService = {
  async trackEmailView(email: string | undefined): Promise<{ error: string | null; creditsRemaining?: number; isAlreadyRevealed?: boolean }> {
    try {
      if (!email) return { error: 'Email is required' };

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { error: 'No session' };

      // Try to reveal email
      const { data, error } = await supabase
        .rpc('reveal_email', {
          p_user_id: user.id,
          p_email: email.trim()
        });

      if (error) {
        console.error('Reveal error:', error);
        return { error: 'Failed to reveal email' };
      }

      // Cast the response
      const result = Array.isArray(data) ? data[0] : data;

      if (!result || !result.success) {
        return { 
          error: result?.error || 'Failed to reveal email',
          creditsRemaining: result?.credits_remaining || 0
        };
      }

      return {
        error: null,
        creditsRemaining: result.credits_remaining,
        isAlreadyRevealed: result.already_revealed
      };

    } catch (error) {
      console.error('Track email view error:', error);
      return { error: 'Failed to track email view' };
    }
  },

  async getEmailViewHistory(): Promise<{ data: EmailView[] | null; error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { data: null, error: 'No session' };

      const { data, error } = await supabase
        .from('email_views')
        .select('*')
        .eq('user_id', user.id)
        .order('viewed_at', { ascending: false });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching history:', error);
      return { data: null, error: 'Failed to fetch history' };
    }
  }
};