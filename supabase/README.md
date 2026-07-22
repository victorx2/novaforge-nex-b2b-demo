# Supabase setup

1. Create project at https://supabase.com
2. Run SQL in order:
   - `migrations/001_init.sql`
   - `seed.sql`
3. Auth → Email enabled (disable confirm email for local demos if needed)
4. Copy project URL + anon key into `apps/web/.env`

Demo logins after seed: `valencia@demo.local` / `demo1234` (and cagua@, caracas@, etc.)
