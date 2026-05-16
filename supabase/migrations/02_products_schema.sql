-- Create the products table
create table public.products (
  id serial primary key,
  name text not null,
  slug text unique not null,
  price numeric not null,
  image text,
  category text,
  description text,
  stock integer default 0 not null,
  featured boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Compatibility columns for existing frontend UI
  details text[],
  sizes text[],
  colors text[],
  reviews numeric
);

-- Set up Row Level Security (RLS)
alter table public.products enable row level security;

-- Products should be viewable by everyone
create policy "Products are viewable by everyone." on public.products
  for select using (true);

-- Only admins can insert/update/delete products (will be enforced later, for now just basic restriction)
create policy "Only authenticated admins can insert products." on public.products
  for insert with check (
    auth.jwt() ->> 'role' = 'authenticated' and 
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Only authenticated admins can update products." on public.products
  for update using (
    auth.jwt() ->> 'role' = 'authenticated' and 
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Only authenticated admins can delete products." on public.products
  for delete using (
    auth.jwt() ->> 'role' = 'authenticated' and 
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Seed initial data to match the static frontend state
insert into public.products (id, name, slug, price, image, category, description, details, reviews, sizes, colors, featured, stock)
values 
  (1, 'Minimalist Black Dress', 'minimalist-black-dress', 2499, '/prod_1_1778924866615.png', 'Women', 'A timeless silhouette crafted from lightweight crepe. This minimalist black dress features a tailored fit, subtle darting, and a fluid drape that moves elegantly with you.', ARRAY['100% Crepe de Chine', 'Hidden back zip closure', 'Midi length', 'Dry clean only'], 4.8, ARRAY['XS', 'S', 'M', 'L'], ARRAY['Black'], true, 50),
  (2, 'Crisp White Shirt', 'crisp-white-shirt', 1999, '/prod_2_1778924880423.png', 'Men', 'The foundation of any wardrobe. Our crisp white shirt is cut from premium organic cotton poplin for breathability and structure, featuring a concealed button placket for an ultra-clean look.', ARRAY['100% Organic Cotton Poplin', 'Concealed placket', 'Tailored fit', 'Machine washable'], 4.9, ARRAY['S', 'M', 'L', 'XL'], ARRAY['White', 'Light Blue'], true, 100),
  (3, 'Leather Handbag', 'leather-handbag', 4999, '/prod_3_1778924918345.png', 'Accessories', 'Expertly crafted in Italy from smooth full-grain leather, this handbag boasts a structured minimalist design with subtle hardware. Generously sized to carry your daily essentials in style.', ARRAY['100% Full-grain Leather', 'Magnetic closure', 'Interior zip pocket', 'Adjustable shoulder strap'], 5.0, ARRAY['One Size'], ARRAY['Black', 'Tan'], true, 25),
  (4, 'Sleek Sneakers', 'sleek-sneakers', 2999, '/prod_4_1778924935977.png', 'Men', 'Elevate your everyday uniform with our sleek leather sneakers. Designed with a stripped-back profile and resting on a comfortable tonal rubber sole for all-day wear.', ARRAY['Italian leather upper', 'Tonal rubber sole', 'Waxed cotton laces', 'Handcrafted in Portugal'], 4.7, ARRAY['40', '41', '42', '43', '44'], ARRAY['White', 'Black'], true, 60),
  (5, 'Oversized Wool Coat', 'oversized-wool-coat', 6499, '/prod_1_1778924866615.png', 'Women', 'Envelop yourself in luxury with this oversized wool coat. Featuring drop shoulders and a tie belt, it offers a relaxed yet deeply sophisticated layering option for colder months.', ARRAY['80% Wool, 20% Cashmere', 'Unlined for soft drape', 'Removable belt', 'Dry clean only'], 4.9, ARRAY['S', 'M', 'L'], ARRAY['Camel', 'Charcoal'], false, 30),
  (6, 'Silk Evening Blouse', 'silk-evening-blouse', 1499, '/prod_2_1778924880423.png', 'Women', 'An ethereal silk blouse designed with a delicate mock neck and draped back. Perfect for evening events where understated luxury is required.', ARRAY['100% Mulberry Silk', 'Mock neck with button fastening', 'Relaxed fit', 'Dry clean only'], 4.6, ARRAY['XS', 'S', 'M', 'L'], ARRAY['Ivory', 'Black', 'Champagne'], false, 40);

-- Reset the serial sequence to 7 since we inserted manually up to 6
ALTER SEQUENCE public.products_id_seq RESTART WITH 7;
