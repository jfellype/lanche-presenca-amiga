-- =====================================================
-- Migração Completa: Resolver Todos os Problemas de Segurança
-- =====================================================

-- 1. POLÍTICAS RLS PARA ANNOUNCEMENTS
CREATE POLICY "Todos podem ver avisos ativos" ON announcements FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins e professores gerenciam avisos" ON announcements FOR ALL
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'teacher'))
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'teacher'));

-- 2. POLÍTICAS RLS PARA MEAL_SERVICE
CREATE POLICY "Estudantes veem próprias refeições" ON meal_service FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM students s 
      WHERE s.id = meal_service.student_id AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "Cozinha e admins veem todas refeições" ON meal_service FOR SELECT
  USING (has_role(auth.uid(), 'kitchen') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Cozinha registra refeições" ON meal_service FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'kitchen') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Cozinha atualiza refeições" ON meal_service FOR UPDATE
  USING (has_role(auth.uid(), 'kitchen') OR has_role(auth.uid(), 'admin'));

-- 3. POLÍTICAS RLS PARA GRADES
CREATE POLICY "Estudantes veem próprias notas" ON grades FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM students s 
      WHERE s.id = grades.student_id AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "Professores e admins gerenciam notas" ON grades FOR ALL
  USING (has_role(auth.uid(), 'teacher') OR has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'teacher') OR has_role(auth.uid(), 'admin'));

-- 4. POLÍTICAS RLS PARA TEACHERS
CREATE POLICY "Professores veem próprios dados" ON teachers FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins veem todos professores" ON teachers FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins gerenciam professores" ON teachers FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- 5. POLÍTICAS RLS PARA SYSTEM_SETTINGS
CREATE POLICY "Todos veem configurações" ON system_settings FOR SELECT
  USING (true);

CREATE POLICY "Apenas admins gerenciam configurações" ON system_settings FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- 6. POLÍTICAS RLS PARA AUTH_AUDIT_LOG
CREATE POLICY "Apenas admins veem logs de auditoria" ON auth_audit_log FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- 7. POLÍTICAS RLS PARA AUTH_RATE_LIMITS
-- Esta tabela é usada por edge functions, então precisa ser acessível pelo service role
-- Não adicionar políticas RLS restritivas aqui

-- 8. POLÍTICAS RLS PARA BOOK_LOANS
CREATE POLICY "Estudantes veem próprios empréstimos" ON book_loans FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM students s 
      WHERE s.id = book_loans.student_id AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "Biblioteca e admins gerenciam empréstimos" ON book_loans FOR ALL
  USING (has_role(auth.uid(), 'library') OR has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'library') OR has_role(auth.uid(), 'admin'));

-- 9. POLÍTICAS RLS PARA KITCHEN_REPORTS
CREATE POLICY "Cozinha vê próprios relatórios" ON kitchen_reports FOR SELECT
  USING (has_role(auth.uid(), 'kitchen') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Cozinha cria relatórios" ON kitchen_reports FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'kitchen'));

CREATE POLICY "Admins gerenciam todos relatórios" ON kitchen_reports FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- =====================================================
-- 10. RECRIAR VIEWS SEM SECURITY DEFINER
-- =====================================================

-- Drop existing views
DROP VIEW IF EXISTS attendance_stats CASCADE;
DROP VIEW IF EXISTS active_menu CASCADE;
DROP VIEW IF EXISTS available_books CASCADE;

-- Recriar attendance_stats sem SECURITY DEFINER
CREATE VIEW attendance_stats 
WITH (security_invoker=true)
AS
SELECT 
  DATE_TRUNC('week', date) AS week,
  COUNT(*) FILTER (WHERE status = 'presente') AS present_count,
  COUNT(*) FILTER (WHERE status = 'ausente') AS absent_count,
  COUNT(*) FILTER (WHERE status = 'atrasado') AS late_count,
  ROUND(
    (COUNT(*) FILTER (WHERE status = 'presente')::numeric / 
    NULLIF(COUNT(*)::numeric, 0)) * 100, 
    2
  ) AS attendance_percentage
FROM attendance
GROUP BY DATE_TRUNC('week', date)
ORDER BY week DESC;

-- Recriar active_menu sem SECURITY DEFINER
CREATE VIEW active_menu 
WITH (security_invoker=true)
AS
SELECT 
  id, name, description, category, meal_type, 
  ingredients, allergens, preparation_time, 
  servings, nutritional_info, status
FROM menu_items
WHERE is_active = true;

-- Recriar available_books sem SECURITY DEFINER
CREATE VIEW available_books 
WITH (security_invoker=true)
AS
SELECT 
  id, isbn, title, author, publisher, 
  publication_year, category, description, 
  location, total_copies, available_copies
FROM books
WHERE is_active = true AND available_copies > 0;

-- Grant permissions nas views
GRANT SELECT ON attendance_stats TO authenticated, anon;
GRANT SELECT ON active_menu TO authenticated, anon;
GRANT SELECT ON available_books TO authenticated, anon;