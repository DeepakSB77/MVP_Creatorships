import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 1
    }
  },
  global: {
    fetch: fetch.bind(globalThis),
    headers: { 
      'x-application-name': 'creatorships',
      'x-client-info': 'supabase-js-client'
    }
  }
})

// Improved connection check
export const checkSupabaseConnection = async () => {
  try {
    const { error } = await supabase
      .from('user_subscriptions')
      .select('id', { count: 'exact', head: true });
    
    if (error) {
      console.error('Connection check error:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Connection check failed:', error);
    return false;
  }
}

// Add reconnection logic
export const reconnectSupabase = async (retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    const isConnected = await checkSupabaseConnection();
    if (isConnected) return true;
    await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
  }
  return false;
} 