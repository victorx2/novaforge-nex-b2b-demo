# Supabase setup (Repuestia / BuscaRepuesto)

1. Create project at https://supabase.com
2. Run SQL in order:
   - `migrations/001_init.sql`
   - `migrations/002_dealers_user_id_admin.sql`
   - (optional) `seed.sql` or `ops_switch_to_automotive.sql`
3. Auth → Email enabled (disable confirm email for local if needed)
4. Copy project URL + anon key into `apps/web/.env`
5. Set your user `app_metadata.role` to `admin` for Operador
