# 🧪 TESTES DE AUTENTICAÇÃO - SIGEA

## Pré-requisitos

```bash
export SUPABASE_URL="https://uhswspoazydiofmwjytr.supabase.co"
export SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoc3dzcG9henlkaW9mbXdqeXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1NDM2NjYsImV4cCI6MjA3MzExOTY2Nn0.MQhzWXP9ou59LxnLVs6j3QXnEr_5JA_xLwIpQmfjcVw"
```

---

## ✅ Teste 1: Cadastro com Senha Forte

**Comando:**
```bash
curl -X POST "${SUPABASE_URL}/auth/v1/signup" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@sigea.edu",
    "password": "SenhaForte123",
    "data": {
      "full_name": "Usuário Teste",
      "role": "student"
    }
  }'
```

**Resultado Esperado:**
```json
{
  "id": "uuid-do-usuario",
  "email": "teste@sigea.edu",
  "confirmation_sent_at": "2025-11-05T...",
  "user_metadata": {
    "full_name": "Usuário Teste",
    "role": "student"
  }
}
```

**Status:** ✅ 200 OK (email de confirmação enviado)

---

## ❌ Teste 2: Cadastro com Senha Fraca (< 8 caracteres)

**Comando:**
```bash
curl -X POST "${SUPABASE_URL}/auth/v1/signup" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "fraco@sigea.edu",
    "password": "Abc123",
    "data": {
      "full_name": "Senha Fraca",
      "role": "student"
    }
  }'
```

**Resultado Esperado:**
```json
{
  "error": "Password should be at least 8 characters"
}
```

**Status:** ❌ 400 Bad Request (bloqueado pelo frontend e backend)

---

## ❌ Teste 3: Cadastro com Senha Sem Complexidade

**Comando:**
```bash
curl -X POST "${SUPABASE_URL}/auth/v1/signup" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "simples@sigea.edu",
    "password": "senhasimples",
    "data": {
      "full_name": "Senha Simples",
      "role": "student"
    }
  }'
```

**Resultado Esperado:** 
- Frontend: Rejeita com mensagem "A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número."
- Backend (Supabase): Aceita, mas frontend já bloqueou

**Status:** ❌ Bloqueado no frontend (validação client-side)

---

## ✅ Teste 4: Login com Credenciais Corretas

**Comando:**
```bash
curl -X POST "${SUPABASE_URL}/auth/v1/token?grant_type=password" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@sigea.edu",
    "password": "SenhaForte123"
  }'
```

**Resultado Esperado:**
```json
{
  "access_token": "jwt-token-aqui",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "refresh-token-aqui",
  "user": {
    "id": "uuid",
    "email": "teste@sigea.edu",
    ...
  }
}
```

**Status:** ✅ 200 OK (sessão criada)

---

## ❌ Teste 5: Login com Senha Incorreta (Rate Limiting)

**Tentativa 1-5:**
```bash
for i in {1..5}; do
  echo "Tentativa $i:"
  curl -X POST "${SUPABASE_URL}/auth/v1/token?grant_type=password" \
    -H "apikey: ${SUPABASE_ANON_KEY}" \
    -H "Content-Type: application/json" \
    -d '{
      "email": "teste@sigea.edu",
      "password": "SenhaErrada123"
    }' 
  echo "\n"
  sleep 1
done
```

**Resultado Esperado (Tentativas 1-4):**
```json
{
  "error": "Invalid login credentials"
}
```
**Status:** ❌ 400 Bad Request

**Resultado Esperado (Tentativa 5+):**
```json
{
  "allowed": false,
  "blocked": true,
  "message": "Muitas tentativas falhadas. Conta bloqueada por 15 minutos.",
  "minutesRemaining": 15
}
```
**Status:** ❌ 429 Too Many Requests

---

## ✅ Teste 6: Recuperação de Senha

**Comando:**
```bash
curl -X POST "${SUPABASE_URL}/auth/v1/recover" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@sigea.edu"
  }'
```

**Resultado Esperado:**
```json
{}
```
**Status:** ✅ 200 OK (email de recuperação enviado)

**Email Recebido:** Link para `https://<dominio>/reset-password?token=...` (expira em 1 hora)

---

## ✅ Teste 7: Redefinir Senha com Token Válido

**Comando:**
```bash
# Primeiro, obter o token do email e fazer o request de update
curl -X PUT "${SUPABASE_URL}/auth/v1/user" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer TOKEN_DO_EMAIL" \
  -H "Content-Type: application/json" \
  -d '{
    "password": "NovaSenhaForte456"
  }'
```

**Resultado Esperado:**
```json
{
  "id": "uuid",
  "email": "teste@sigea.edu",
  ...
}
```
**Status:** ✅ 200 OK (senha atualizada)

---

## ❌ Teste 8: Usar Token de Reset Duas Vezes (Single-Use)

**Comando:**
```bash
# Tentar usar o mesmo token novamente
curl -X PUT "${SUPABASE_URL}/auth/v1/user" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer TOKEN_JA_USADO" \
  -H "Content-Type: application/json" \
  -d '{
    "password": "OutraSenha789"
  }'
```

**Resultado Esperado:**
```json
{
  "error": "Invalid token"
}
```
**Status:** ❌ 401 Unauthorized (token já usado)

---

## ✅ Teste 9: Logout e Invalidação de Sessão

**Comando:**
```bash
# Obter access_token do login primeiro
ACCESS_TOKEN="token-do-login"

# Fazer logout
curl -X POST "${SUPABASE_URL}/auth/v1/logout" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}"
```

**Resultado Esperado:**
```json
{}
```
**Status:** ✅ 200 OK (sessão invalidada)

**Verificação:**
```bash
# Tentar usar o token invalidado
curl -X GET "${SUPABASE_URL}/rest/v1/profiles?select=*" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}"
```

**Resultado Esperado:**
```json
{
  "error": "Invalid token"
}
```
**Status:** ❌ 401 Unauthorized (token inválido após logout)

---

## ❌ Teste 10: Open Redirect Protection

**No Frontend (React Router):**

Tentativa de redirect malicioso:
```
https://<dominio>/auth?next=https://evil.com
```

**Resultado Esperado:**
- Sistema ignora o parâmetro `next` se não for uma rota interna válida
- Redireciona baseado no role do usuário (admin → /admin, student → /student, etc.)
- Nunca redireciona para domínios externos

**Status:** ✅ Protegido (validação de redirects baseada em roles)

---

## ✅ Teste 11: CSRF Protection

**Comando:**
```bash
# Tentar fazer request sem cookies/sessão válida
curl -X POST "${SUPABASE_URL}/rest/v1/profiles" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Hack Attempt"
  }'
```

**Resultado Esperado:**
```json
{
  "error": "new row violates row-level security policy"
}
```
**Status:** ❌ 403 Forbidden (RLS bloqueou)

---

## 📊 Verificar Logs de Auditoria (Apenas Admins)

**SQL Query:**
```sql
-- Executar no Supabase SQL Editor
SELECT 
  email,
  action,
  success,
  error_message,
  created_at
FROM auth_audit_log
WHERE email = 'teste@sigea.edu'
ORDER BY created_at DESC
LIMIT 20;
```

**Resultado Esperado:**
- Lista todas tentativas de login, sucesso/falha
- Inclui informações de IP e user agent
- Sem senhas armazenadas

---

## 🔄 Verificar Rate Limiting

**SQL Query:**
```sql
-- Executar no Supabase SQL Editor
SELECT 
  identifier,
  action,
  attempts,
  blocked_until,
  last_attempt
FROM auth_rate_limits
WHERE identifier = 'teste@sigea.edu';
```

**Resultado Esperado:**
- Mostra número de tentativas
- Timestamp do bloqueio se excedeu limite
- `blocked_until` NULL se não bloqueado

---

## 📝 Resumo dos Testes

| # | Teste | Status | Resultado |
|---|-------|--------|-----------|
| 1 | Cadastro senha forte | ✅ | 200 OK |
| 2 | Cadastro senha fraca | ❌ | Bloqueado |
| 3 | Cadastro sem complexidade | ❌ | Bloqueado |
| 4 | Login correto | ✅ | 200 OK |
| 5 | Rate limiting | ✅ | 429 após 5 tentativas |
| 6 | Recuperação de senha | ✅ | Email enviado |
| 7 | Reset senha válido | ✅ | 200 OK |
| 8 | Token single-use | ✅ | 401 ao reusar |
| 9 | Logout | ✅ | Sessão invalidada |
| 10 | Open redirect | ✅ | Bloqueado |
| 11 | CSRF | ✅ | RLS bloqueou |

---

## ⚠️ Notas Importantes

1. **Email Confirmation**: Se habilitado no Supabase, usuários devem confirmar email antes de fazer login. Para testes rápidos, desabilite em: `Authentication → Providers → Email → Enable email confirmations`

2. **Rate Limiting**: O rate limiting é implementado via edge function. Certifique-se de que a função `auth-rate-limit` está deployada.

3. **Logs**: Todos os testes de autenticação são registrados em `auth_audit_log` para auditoria.

4. **Produção**: Em produção, SEMPRE mantenha "Confirm email" HABILITADO para segurança adicional.
