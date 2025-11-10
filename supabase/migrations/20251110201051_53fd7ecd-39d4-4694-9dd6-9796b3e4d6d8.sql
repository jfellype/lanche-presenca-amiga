-- Remover política antiga que pode estar causando conflito
DROP POLICY IF EXISTS "Todos podem ver cardápio" ON menu_items;

-- Criar política para usuários autenticados visualizarem o cardápio
CREATE POLICY "Permitir leitura autenticada no cardapio"
ON public.menu_items
FOR SELECT
TO authenticated
USING (true);

-- Manter política existente para cozinha e admins gerenciarem
-- (não precisa recriar, já existe)