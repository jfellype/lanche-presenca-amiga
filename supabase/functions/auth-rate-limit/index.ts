import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RateLimitEntry {
  attempts: number;
  blocked_until: string | null;
  last_attempt: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { email, action } = await req.json();

    if (!email || !action) {
      return new Response(
        JSON.stringify({ error: "Email e action são obrigatórios" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verificar tentativas
    const { data: existing, error: fetchError } = await supabase
      .from("auth_rate_limits")
      .select("*")
      .eq("identifier", email)
      .eq("action", action)
      .maybeSingle();

    if (fetchError && fetchError.code !== "PGRST116") {
      throw fetchError;
    }

    const now = new Date();
    const MAX_ATTEMPTS = 5;
    const BLOCK_DURATION_MINUTES = 15;
    const RESET_WINDOW_MINUTES = 5;

    // Se existe e está bloqueado
    if (existing?.blocked_until) {
      const blockedUntil = new Date(existing.blocked_until);
      if (now < blockedUntil) {
        const minutesRemaining = Math.ceil((blockedUntil.getTime() - now.getTime()) / 60000);
        return new Response(
          JSON.stringify({
            allowed: false,
            blocked: true,
            message: `Muitas tentativas falhadas. Tente novamente em ${minutesRemaining} minutos.`,
            minutesRemaining,
          }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Verificar janela de reset
    let attempts = 1;
    if (existing) {
      const lastAttempt = new Date(existing.last_attempt);
      const minutesSinceLastAttempt = (now.getTime() - lastAttempt.getTime()) / 60000;

      if (minutesSinceLastAttempt < RESET_WINDOW_MINUTES) {
        attempts = existing.attempts + 1;
      }
    }

    // Se excedeu tentativas, bloquear
    let blockedUntil = null;
    if (attempts >= MAX_ATTEMPTS) {
      blockedUntil = new Date(now.getTime() + BLOCK_DURATION_MINUTES * 60000).toISOString();
    }

    // Atualizar ou inserir
    const { error: upsertError } = await supabase
      .from("auth_rate_limits")
      .upsert({
        identifier: email,
        action,
        attempts,
        last_attempt: now.toISOString(),
        blocked_until: blockedUntil,
      }, {
        onConflict: "identifier,action",
      });

    if (upsertError) throw upsertError;

    if (blockedUntil) {
      return new Response(
        JSON.stringify({
          allowed: false,
          blocked: true,
          message: `Muitas tentativas falhadas. Conta bloqueada por ${BLOCK_DURATION_MINUTES} minutos.`,
          minutesRemaining: BLOCK_DURATION_MINUTES,
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        allowed: true,
        attempts,
        remaining: MAX_ATTEMPTS - attempts,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Rate limit error:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
