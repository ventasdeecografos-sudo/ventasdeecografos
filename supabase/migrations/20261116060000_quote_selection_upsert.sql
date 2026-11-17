alter table public.quote_requests
  add column request_token uuid;

update public.quote_requests
set request_token = gen_random_uuid()
where request_token is null;

alter table public.quote_requests
  alter column request_token set default gen_random_uuid(),
  alter column request_token set not null;

create unique index quote_requests_request_token_idx
  on public.quote_requests (request_token);
