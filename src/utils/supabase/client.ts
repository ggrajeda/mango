import { SupabaseClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr"
import { Database } from "@/types/database.types"

export function createClient(): SupabaseClient<Database> {
  // Create a supabase client on the browser with project's credentials
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
