-- ═══════════════════════════════════════════════════════════════════════════
-- Supabase Storage: product-images bucket setup
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Create the storage bucket (public = images served without auth tokens)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,  -- 5 MB limit enforced server-side
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do nothing;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Row Level Security policies on storage.objects
-- ─────────────────────────────────────────────────────────────────────────────

-- Anyone (public) can read/download product images (storefront rendering)
create policy "Public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Only authenticated users (admins) can upload new images
create policy "Authenticated users can upload product images"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images'
    and auth.role() = 'authenticated'
  );

-- Only authenticated users (admins) can replace/update images
create policy "Authenticated users can update product images"
  on storage.objects for update
  using (
    bucket_id = 'product-images'
    and auth.role() = 'authenticated'
  );

-- Only authenticated users (admins) can delete images
create policy "Authenticated users can delete product images"
  on storage.objects for delete
  using (
    bucket_id = 'product-images'
    and auth.role() = 'authenticated'
  );
