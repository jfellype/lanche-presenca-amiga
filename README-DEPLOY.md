# 🚀 GUIA DE DEPLOY - SIGEA AUTH FIXES

## 📦 Pré-requisitos

- Projeto SIGEA já configurado no Lovable
- Acesso ao Supabase Dashboard: https://supabase.com/dashboard/project/uhswspoazydiofmwjytr
- Git configurado (se usar GitHub sync)

---

## 🔄 Deploy Automático (Lovable)

### Passo 1: Código Frontend
✅ **JÁ DEPLOYADO AUTOMATICAMENTE** quando você salvou as alterações no Lovable.

As seguintes alterações já estão ativas:
- `src/components/Auth.tsx` (validação de senha, password reset)
- `src/pages/ResetPassword.tsx` (nova página)
- `src/App.tsx` (nova rota)
- `src/hooks/useAuth.tsx` (correções de redirecionamento)

### Passo 2: Banco de Dados
✅ **MIGRATION JÁ EXECUTADA** quando você aprovou a migration.

Tabelas criadas:
- `auth_rate_limits`
- `auth_audit_log`

Funções criadas:
- `cleanup_auth_rate_limits()`

### Passo 3: Edge Functions
✅ **EDGE FUNCTION JÁ DEPLOYADA** automaticamente.

Função ativa:
- `auth-rate-limit`

---

## ⚙️ Configurações Obrigatórias no Supabase

### 1. Configurar URLs de Redirecionamento

**Onde:** https://supabase.com/dashboard/project/uhswspoazydiofmwjytr/auth/url-configuration

**O que fazer:**

1. **Site URL:**
   ```
   https://<seu-dominio>.lovableproject.com
   ```
   (Substitua `<seu-dominio>` pela URL do seu projeto Lovable)

2. **Redirect URLs** (adicione ambas):
   ```
   https://<seu-dominio>.lovableproject.com/reset-password
   https://<seu-dominio>.lovableproject.com/
   ```

3. Clique em **Save**

---

### 2. Verificar Email Auth

**Onde:** https://supabase.com/dashboard/project/uhswspoazydiofmwjytr/auth/providers

**O que verificar:**

1. ✅ **Email Auth** deve estar habilitado
2. ✅ **Enable Email Signup** deve estar marcado
3. ⚠️ **Enable Email Confirmations:**
   - **Produção:** HABILITADO (recomendado)
   - **Testes/Desenvolvimento:** DESABILITADO (para testes mais rápidos)

4. Clique em **Save** se fizer alterações

---

### 3. (RECOMENDADO) Habilitar Leaked Password Protection

**Onde:** https://supabase.com/dashboard/project/uhswspoazydiofmwjytr/auth/providers

**O que fazer:**

1. Procure por **"Password Security"** ou **"Leaked Password Protection"**
2. Habilite a opção
3. Isso impede que usuários usem senhas comprometidas em vazamentos conhecidos
4. Clique em **Save**

---

## 🔐 Variáveis de Ambiente

### Variáveis já configuradas:
```bash
SUPABASE_URL=https://uhswspoazydiofmwjytr.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=(automático no Supabase)
```

✅ **Nenhuma nova variável necessária!** Todas as variáveis estão configuradas automaticamente.

---

## 🧪 Teste Rápido Pós-Deploy

### Teste 1: Acesse a página de auth
```
https://<seu-dominio>.lovableproject.com/auth
```
✅ Deve carregar a página de login/cadastro

### Teste 2: Tente cadastrar com senha fraca
```
Email: teste@test.com
Senha: abc123
```
❌ Deve exibir erro: "A senha deve ter no mínimo 8 caracteres"

### Teste 3: Cadastre com senha forte
```
Email: teste@test.com
Senha: SenhaForte123
Nome: Teste Usuario
Role: Estudante
```
✅ Deve exibir: "Cadastro realizado! Verifique seu email..."

### Teste 4: Recuperação de senha
1. Clique em "Esqueceu sua senha?"
2. Digite um email
3. Clique em "Enviar Email de Recuperação"
✅ Deve exibir: "Verifique sua caixa de entrada..."

### Teste 5: Rate Limiting
1. Na página de login, digite:
   - Email: qualquer@email.com
   - Senha: senhaerrada
2. Clique em "Entrar" 5 vezes seguidas
✅ Após 5 tentativas, deve exibir: "Muitas tentativas falhadas..."

---

## 📊 Monitoramento

### Ver logs de Edge Function

**Onde:** https://supabase.com/dashboard/project/uhswspoazydiofmwjytr/functions/auth-rate-limit/logs

**O que procurar:**
- Requests bem-sucedidos (200 OK)
- Bloqueios por rate limit (429)
- Erros (500) - se houver, investigar

### Ver logs de autenticação (SQL)

**Onde:** https://supabase.com/dashboard/project/uhswspoazydiofmwjytr/sql/new

**Query para ver tentativas recentes:**
```sql
SELECT 
  email,
  action,
  success,
  error_message,
  created_at
FROM auth_audit_log
ORDER BY created_at DESC
LIMIT 50;
```

### Ver status de rate limiting (SQL)

**Query:**
```sql
SELECT 
  identifier AS email,
  action,
  attempts,
  blocked_until,
  last_attempt
FROM auth_rate_limits
WHERE blocked_until IS NOT NULL
ORDER BY last_attempt DESC;
```

---

## 🛠️ Manutenção

### Limpeza diária de rate limits (opcional)

**Opção 1: Manual**

Execute no SQL Editor:
```sql
SELECT public.cleanup_auth_rate_limits();
```

**Opção 2: Automatizada (via Supabase Cron - requer extensão pg_cron)**

```sql
-- Habilitar extensão (uma vez)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Criar job diário às 3:00 AM
SELECT cron.schedule(
  'cleanup-auth-rate-limits',
  '0 3 * * *',
  'SELECT public.cleanup_auth_rate_limits();'
);
```

---

## 🔙 Rollback (Se Necessário)

### Se algo der errado:

1. **Reverter código frontend:**
   - No Lovable, use o histórico de versões (⏰ ícone no topo)
   - Selecione a versão anterior às alterações
   - Clique em "Revert"

2. **Reverter migration do banco:**
   
   **⚠️ ATENÇÃO:** Apenas faça isso se absolutamente necessário!
   
   ```sql
   -- Remover tabelas criadas
   DROP TABLE IF EXISTS public.auth_audit_log CASCADE;
   DROP TABLE IF EXISTS public.auth_rate_limits CASCADE;
   
   -- Remover função
   DROP FUNCTION IF EXISTS public.cleanup_auth_rate_limits();
   
   -- Remover trigger
   DROP TRIGGER IF EXISTS update_auth_rate_limits_updated_at 
     ON public.auth_rate_limits;
   ```

3. **Desabilitar edge function:**
   - No `supabase/config.toml`, remova:
   ```toml
   [functions.auth-rate-limit]
   verify_jwt = false
   ```

---

## 📝 Checklist de Deploy

- [ ] Código frontend deployado (automático no Lovable)
- [ ] Migration executada (aprovada manualmente)
- [ ] Edge function deployada (automática)
- [ ] URLs de redirect configuradas no Supabase
- [ ] Email Auth verificado e configurado
- [ ] (Opcional) Leaked Password Protection habilitado
- [ ] Teste rápido realizado com sucesso
- [ ] Logs de edge function verificados
- [ ] Sistema de auditoria funcionando (query SQL)

---

## 🆘 Troubleshooting

### Problema: Email de confirmação não chega

**Solução:**
1. Verifique spam/lixo eletrônico
2. No Supabase → Authentication → Providers → Email
3. Verifique se "Enable Email Confirmations" está habilitado
4. Teste com outro email

### Problema: Rate limiting não funciona

**Solução:**
1. Verifique logs da edge function: https://supabase.com/dashboard/project/uhswspoazydiofmwjytr/functions/auth-rate-limit/logs
2. Verifique se a função está deployada
3. Verifique se a tabela `auth_rate_limits` existe:
   ```sql
   SELECT * FROM auth_rate_limits LIMIT 1;
   ```

### Problema: Redirecionamento errado após login

**Solução:**
1. Verifique se o role está correto na tabela `user_roles`:
   ```sql
   SELECT * FROM user_roles WHERE user_id = 'SEU_USER_ID';
   ```
2. Verifique se o perfil existe:
   ```sql
   SELECT * FROM profiles WHERE id = 'SEU_USER_ID';
   ```

### Problema: Password reset não funciona

**Solução:**
1. Verifique se a URL de redirect está configurada no Supabase
2. Verifique se a rota `/reset-password` existe no frontend
3. Teste o link diretamente: `https://<dominio>/reset-password`

---

## 📞 Suporte

**Documentação:**
- `SECURITY-CHECKLIST.md` - Checklist de segurança
- `TESTES-AUTH.md` - Testes detalhados com cURL
- `CHANGELOG-AUTH.md` - Histórico de mudanças

**Logs úteis:**
- Edge Functions: https://supabase.com/dashboard/project/uhswspoazydiofmwjytr/functions
- Auth Logs: https://supabase.com/dashboard/project/uhswspoazydiofmwjytr/auth/users
- Database Logs: https://supabase.com/dashboard/project/uhswspoazydiofmwjytr/logs/postgres-logs

---

## ✅ Deploy Completo!

Se você chegou até aqui e todos os testes passaram, parabéns! 🎉

Seu sistema de autenticação agora está:
- ✅ Seguro
- ✅ Com rate limiting
- ✅ Com password reset funcional
- ✅ Com auditoria completa
- ✅ Pronto para produção

**Última atualização:** 2025-11-05  
**Versão:** 1.0.0
