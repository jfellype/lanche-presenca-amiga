-- Tabela para rate limiting de autenticação
CREATE TABLE IF NOT EXISTS public.auth_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL,
  action TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 1,
  last_attempt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  blocked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(identifier, action)
);

-- Index para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_auth_rate_limits_identifier ON public.auth_rate_limits(identifier, action);
CREATE INDEX IF NOT EXISTS idx_auth_rate_limits_blocked ON public.auth_rate_limits(blocked_until) WHERE blocked_until IS NOT NULL;

-- RLS: apenas service role pode acessar (usado pela edge function)
ALTER TABLE public.auth_rate_limits ENABLE ROW LEVEL SECURITY;

-- Tabela para log de tentativas de autenticação (auditoria)
CREATE TABLE IF NOT EXISTS public.auth_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  action TEXT NOT NULL,
  success BOOLEAN NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index para consultas de auditoria
CREATE INDEX IF NOT EXISTS idx_auth_audit_email ON public.auth_audit_log(email, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_auth_audit_created ON public.auth_audit_log(created_at DESC);

-- RLS: apenas admins podem ver logs
ALTER TABLE public.auth_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins podem ver logs de auditoria"
ON public.auth_audit_log
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Trigger para auto-atualizar updated_at
CREATE TRIGGER update_auth_rate_limits_updated_at
BEFORE UPDATE ON public.auth_rate_limits
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Função para limpar rate limits expirados (executar periodicamente)
CREATE OR REPLACE FUNCTION public.cleanup_auth_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.auth_rate_limits
  WHERE blocked_until IS NOT NULL 
    AND blocked_until < NOW() - INTERVAL '1 day';
  
  DELETE FROM public.auth_rate_limits
  WHERE last_attempt < NOW() - INTERVAL '1 day'
    AND blocked_until IS NULL;
END;
$$;

COMMENT ON TABLE public.auth_rate_limits IS 'Rate limiting para operações de autenticação';
COMMENT ON TABLE public.auth_audit_log IS 'Log de auditoria de tentativas de autenticação';
COMMENT ON FUNCTION public.cleanup_auth_rate_limits IS 'Remove registros antigos de rate limit. Executar diariamente via cron job.';