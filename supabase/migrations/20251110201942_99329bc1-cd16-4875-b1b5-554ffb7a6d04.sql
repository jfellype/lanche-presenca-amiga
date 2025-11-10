-- 1) Recriar enum app_role incluindo library
DROP TYPE IF EXISTS public.app_role CASCADE;
CREATE TYPE public.app_role AS ENUM ('admin','teacher','student','kitchen','library');

-- 2) Recriar user_roles com o novo enum
DROP TABLE IF EXISTS public.user_roles CASCADE;
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3) Políticas para user_roles
CREATE POLICY "Users veem próprios papéis"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins podem inserir papéis"
ON public.user_roles FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
);

CREATE POLICY "Admins podem deletar papéis"
ON public.user_roles FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
);

-- 4) Função de checagem de papel (SECURITY DEFINER para evitar recursão)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  );
$$;

-- 5) Corrigir políticas que causavam recursão infinita
-- Profiles: remover todas políticas antigas e criar novas sem recursão
DROP POLICY IF EXISTS "Usuários podem ver próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Admins podem ver todos os perfis" ON public.profiles;
DROP POLICY IF EXISTS "Admins podem ver/gerenciar perfis" ON public.profiles;

CREATE POLICY "User vê próprio perfil"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "User atualiza próprio perfil"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Admin vê todos perfis"
ON public.profiles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin gerencia perfis"
ON public.profiles FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 6) Menu items: substituir referência a profiles por has_role
DROP POLICY IF EXISTS "Todos podem ver cardápio" ON public.menu_items;
DROP POLICY IF EXISTS "Permitir leitura autenticada no cardapio" ON public.menu_items;
DROP POLICY IF EXISTS "Cozinha e admins podem gerenciar cardápio" ON public.menu_items;
DROP POLICY IF EXISTS "Kitchen/Admin gerenciam cardapio" ON public.menu_items;

CREATE POLICY "Autenticados veem cardápio"
ON public.menu_items FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Kitchen/Admin gerenciam menu"
ON public.menu_items FOR ALL
USING (public.has_role(auth.uid(), 'kitchen') OR public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'kitchen') OR public.has_role(auth.uid(), 'admin'));

-- 7) Livros: substituir referência a profiles por has_role
DROP POLICY IF EXISTS "Todos podem ver livros" ON public.books;
DROP POLICY IF EXISTS "Biblioteca e admins podem gerenciar livros" ON public.books;
DROP POLICY IF EXISTS "Library/Admin gerenciam livros" ON public.books;

CREATE POLICY "Autenticados veem livros ativos"
ON public.books FOR SELECT
TO authenticated
USING (is_active = true);

CREATE POLICY "Library/Admin gerenciam livros"
ON public.books FOR ALL
USING (public.has_role(auth.uid(), 'library') OR public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'library') OR public.has_role(auth.uid(), 'admin'));

-- 8) Attendance: corrigir política
DROP POLICY IF EXISTS "Ver presença própria ou se for professor/admin" ON public.attendance;

CREATE POLICY "Estudantes veem própria presença"
ON public.attendance FOR SELECT
USING (
  EXISTS (SELECT 1 FROM students s WHERE s.id = attendance.student_id AND s.user_id = auth.uid())
);

CREATE POLICY "Professores/Admins veem toda presença"
ON public.attendance FOR SELECT
USING (public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin'));

-- 9) Students: corrigir política recursiva
DROP POLICY IF EXISTS "Estudantes podem ver próprios dados" ON public.students;

CREATE POLICY "Estudante vê próprios dados"
ON public.students FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Teacher/Admin veem students"
ON public.students FOR SELECT
USING (public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin'));

-- 10) Garantir trigger de criação (atualizar para incluir library)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuário'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  
  -- Insert user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'student')
  );
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();