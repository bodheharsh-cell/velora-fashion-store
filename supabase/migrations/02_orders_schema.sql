-- Create public.orders table
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null, -- Nullable for guest checkout
  customer_name text not null,
  customer_email text not null,
  items jsonb not null default '[]'::jsonb,
  total numeric not null default 0,
  status text not null default 'Pending' check (status in ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled')),
  shipping_address jsonb,
  payment_method text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on public.orders
alter table public.orders enable row level security;

-- RLS Policies for public.orders

-- 1. Anyone can insert an order (Guest checkout or Logged in)
-- If we want to strictly secure it, we could enforce that IF user_id is provided, it matches auth.uid().
create policy "Anyone can insert orders." on public.orders
  for insert with check (
    -- Allow guest (user_id is null) OR logged in user inserting their own order
    user_id is null or auth.uid() = user_id
  );

-- 2. Users can view their own orders
create policy "Users can view their own orders." on public.orders
  for select using (
    auth.uid() = user_id
  );

-- 3. Admins can view ALL orders
create policy "Admins can view all orders." on public.orders
  for select using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- 4. Admins can update ALL orders
create policy "Admins can update all orders." on public.orders
  for update using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );
