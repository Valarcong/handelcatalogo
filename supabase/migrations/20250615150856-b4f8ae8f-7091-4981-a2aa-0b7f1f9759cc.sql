
-- Crear el bucket público para imágenes de productos
insert into storage.buckets (id, name, public)
values ('products', 'products', true);

-- Política: acceso público de lectura a las imágenes del bucket products
create policy "Public read access to products bucket"
on storage.objects for select
using (bucket_id = 'products');

-- Política: usuarios autenticados pueden subir imágenes al bucket products
create policy "Authenticated upload to products bucket"
on storage.objects for insert
with check (
  bucket_id = 'products'
  AND auth.role() = 'authenticated'
);

-- Política: los propietarios (creador) del archivo pueden actualizar sus objetos
create policy "Object owner can update in products bucket"
on storage.objects for update using (
  bucket_id = 'products'
  AND auth.uid() = owner
);

-- Política: los propietarios (creador) del archivo pueden borrar sus objetos
create policy "Object owner can delete in products bucket"
on storage.objects for delete using (
  bucket_id = 'products'
  AND auth.uid() = owner
);
