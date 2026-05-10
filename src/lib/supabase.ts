<<<<<<< HEAD
﻿import { createBrowserClient, createServerClient } from '@supabase/ssr';
=======
import { createBrowserClient, createServerClient } from '@supabase/ssr';
>>>>>>> a545130e6e5841d6c140e642919c5c18225a1081
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export function createBrowserSupabase() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

export async function createServerSupabase() {
  const cookieStore = await cookies();
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
<<<<<<< HEAD
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: object }>) {
=======
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
>>>>>>> a545130e6e5841d6c140e642919c5c18225a1081
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options as any)
          );
        } catch {}
      },
    },
  });
}

export function createAdminSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
