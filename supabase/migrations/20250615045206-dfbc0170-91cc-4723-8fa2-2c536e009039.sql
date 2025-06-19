
-- Enable Row Level Security on pedidos
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;

-- POLICY 1: Only authenticated users can insert orders
DROP POLICY IF EXISTS "authenticated can insert pedidos" ON public.pedidos;
CREATE POLICY "authenticated can insert pedidos"
  ON public.pedidos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- POLICY 2: Only creator can view their own orders (by email for now)
DROP POLICY IF EXISTS "creators can select their own pedidos" ON public.pedidos;
CREATE POLICY "creators can select their own pedidos"
  ON public.pedidos
  FOR SELECT
  TO authenticated
  USING (
    cliente_email IS NOT NULL AND
    (auth.email() IS NOT NULL AND lower(auth.email()) = lower(cliente_email))
  );

-- POLICY 3: Only the creator can update/delete their own order
DROP POLICY IF EXISTS "creator can update own pedido" ON public.pedidos;
CREATE POLICY "creator can update own pedido"
  ON public.pedidos
  FOR UPDATE
  TO authenticated
  USING (
    cliente_email IS NOT NULL AND
    (auth.email() IS NOT NULL AND lower(auth.email()) = lower(cliente_email))
  );

DROP POLICY IF EXISTS "creator can delete own pedido" ON public.pedidos;
CREATE POLICY "creator can delete own pedido"
  ON public.pedidos
  FOR DELETE
  TO authenticated
  USING (
    cliente_email IS NOT NULL AND
    (auth.email() IS NOT NULL AND lower(auth.email()) = lower(cliente_email))
  );

-- POLICY 4: Admins can manage all pedidos (view/update/delete/insert)
DROP POLICY IF EXISTS "admins can manage all pedidos" ON public.pedidos;
CREATE POLICY "admins can manage all pedidos"
  ON public.pedidos
  FOR ALL
  TO authenticated
  USING (
    public.user_has_specific_role(auth.uid(), 'Administrador')
  );

