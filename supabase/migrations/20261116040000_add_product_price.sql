alter table public.products
  add column price bigint check (price is null or price >= 0);
