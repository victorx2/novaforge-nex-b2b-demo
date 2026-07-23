-- Confirmar email del operador (necesario si Confirm email está activo)
update auth.users
set
  email_confirmed_at = coalesce(email_confirmed_at, now()),
  confirmed_at = coalesce(confirmed_at, now())
where email = 'victorcarrillox2@gmail.com';

-- Verificar
select email, raw_app_meta_data->>'role' as role, email_confirmed_at
from auth.users
where email = 'victorcarrillox2@gmail.com';
