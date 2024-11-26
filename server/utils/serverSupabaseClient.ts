// server/utils/serverSupabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase server-side credentials");
}

export const serverSupabase = createClient(supabaseUrl, supabaseServiceKey, {
  db: { schema: "settlethis" },
  auth: {
    persistSession: false,
  },
});
