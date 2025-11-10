-- Remover e recriar views sem SECURITY DEFINER
-- Isso garante que as views usem as permissões do usuário consultando, não do criador

-- 1) Remover views antigas
DROP VIEW IF EXISTS public.attendance_stats CASCADE;
DROP VIEW IF EXISTS public.active_menu CASCADE;
DROP VIEW IF EXISTS public.available_books CASCADE;

-- 2) Recriar attendance_stats sem SECURITY DEFINER
CREATE VIEW public.attendance_stats AS
SELECT 
  date_trunc('week', date) as week,
  COUNT(*) FILTER (WHERE status = 'presente') as present_count,
  COUNT(*) FILTER (WHERE status = 'ausente') as absent_count,
  COUNT(*) FILTER (WHERE status = 'atrasado') as late_count,
  ROUND(
    (COUNT(*) FILTER (WHERE status = 'presente')::numeric / 
     NULLIF(COUNT(*), 0)::numeric) * 100, 
    2
  ) as attendance_percentage
FROM public.attendance
GROUP BY date_trunc('week', date)
ORDER BY week DESC;

-- 3) Recriar active_menu sem SECURITY DEFINER
CREATE VIEW public.active_menu AS
SELECT 
  id,
  name,
  description,
  category,
  meal_type,
  ingredients,
  allergens,
  preparation_time,
  servings,
  status,
  nutritional_info
FROM public.menu_items
WHERE is_active = true
ORDER BY meal_type, name;

-- 4) Recriar available_books sem SECURITY DEFINER
CREATE VIEW public.available_books AS
SELECT 
  id,
  isbn,
  title,
  author,
  publisher,
  publication_year,
  category,
  description,
  location,
  total_copies,
  available_copies
FROM public.books
WHERE is_active = true AND available_copies > 0
ORDER BY title;

-- 5) Conceder permissões apropriadas nas views
-- Views respeitarão as políticas RLS das tabelas base
GRANT SELECT ON public.attendance_stats TO authenticated;
GRANT SELECT ON public.active_menu TO authenticated;
GRANT SELECT ON public.available_books TO authenticated;