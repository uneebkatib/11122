
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xcfjrmmxudyynzyyzomo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjZmpybW14dWR5eW56eXl6b21vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2NTg5MDAsImV4cCI6MjA1NDIzNDkwMH0.Znevur32TI6rRjfdXcbHsC4N23eRP_Vh3BUsIUeqD94";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    global: {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  }
);

