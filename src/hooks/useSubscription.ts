import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useSubscription() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [pagesViewed, setPagesViewed] = useState(0);
  const [creditsRemaining, setCreditsRemaining] = useState<number>(0);

  const checkSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('credits_remaining, is_subscribed')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Subscription check error:', error);
        return;
      }

      setCreditsRemaining(data?.credits_remaining || 0);
      setIsSubscribed(data?.is_subscribed || false);
      
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  useEffect(() => {
    checkSubscription();
  }, []);

  return {
    isSubscribed,
    pagesViewed,
    creditsRemaining,
    checkSubscription,
    incrementPageView: () => setPagesViewed(prev => prev + 1)
  };
} 