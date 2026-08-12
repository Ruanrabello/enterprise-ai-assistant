import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    "Supabase não configurado. Defina VITE_SUPABASE_URL e " +
      "VITE_SUPABASE_PUBLISHABLE_KEY em Frontend/.env.local.",
  );
}

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey,
);
