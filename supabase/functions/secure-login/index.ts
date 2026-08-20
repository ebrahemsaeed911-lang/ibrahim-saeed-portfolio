import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Service client bypasses RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Check if email is banned
    const { data: isBanned, error: banError } = await supabase.rpc("is_email_banned", {
      check_email: email,
    });

    if (banError) {
      console.error("Ban check error:", banError);
    }

    if (isBanned) {
      // Get remaining time
      const { data: remaining } = await supabase.rpc("get_ban_remaining", {
        check_email: email,
      });

      return new Response(
        JSON.stringify({
          error: `Too many failed attempts. Try again in ${Math.ceil((remaining || 900) / 60)} minutes.`,
          banned: true,
          remaining_seconds: remaining || 900,
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Attempt login via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      // Record failed attempt
      await supabase.rpc("record_login_attempt", {
        attempt_email: email,
        was_success: false,
      });

      // Check how many attempts are left
      const { data: remaining } = await supabase.rpc("get_ban_remaining", {
        check_email: email,
      });
      const { data: countData } = await supabase
        .from("login_attempts")
        .select("id", { count: "exact", head: true })
        .eq("email", email)
        .eq("success", false)
        .gt("attempted_at", new Date(Date.now() - 15 * 60 * 1000).toISOString());

      const attempts = countData || 0;
      const left = 3 - attempts;

      return new Response(
        JSON.stringify({
          error: authError.message,
          attempts_remaining: Math.max(0, left),
        }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Success - clear attempts
    await supabase.rpc("clear_login_attempts", { clear_email: email });

    return new Response(
      JSON.stringify({
        session: authData.session,
        user: authData.user,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
