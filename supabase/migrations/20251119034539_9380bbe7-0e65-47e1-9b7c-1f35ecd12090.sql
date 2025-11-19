-- Corrigir políticas RLS para menu_items permitindo leitura autenticada
DROP POLICY IF EXISTS "auth_view_menu" ON menu_items;
DROP POLICY IF EXISTS "Autenticados veem cardápio" ON menu_items;

-- Política para todos usuários autenticados verem o cardápio
CREATE POLICY "Usuários autenticados veem cardápio ativo"
ON menu_items
FOR SELECT
TO authenticated
USING (is_active = true);

-- Política para usuários anônimos verem cardápio público
CREATE POLICY "Público vê cardápio ativo"
ON menu_items
FOR SELECT
TO anon
USING (is_active = true);

-- Corrigir políticas RLS para announcements
DROP POLICY IF EXISTS "Todos podem ver avisos ativos" ON announcements;

CREATE POLICY "Todos veem avisos ativos"
ON announcements
FOR SELECT
TO authenticated, anon
USING (is_active = true);