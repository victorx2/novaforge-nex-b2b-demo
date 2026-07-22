# BuscaRepuesto (programa real)

Directorio multi-local de rodamientos: busca código → locales con teléfono y dirección. Repuestero se registra gratis y sube CSV. Sin precios ni membresía.

## Monorepo

```text
apps/web              # Vite + React (UI)
packages/shared       # tipos, CSV, estados, búsqueda
supabase/             # migraciones + seed
```

## Setup Supabase (obligatorio)

1. Crea un proyecto en https://supabase.com
2. SQL Editor → pega y ejecuta `supabase/migrations/001_init.sql`
3. Luego ejecuta `supabase/seed.sql` (6 locales demo)
4. En Authentication → Providers → Email: activa email (puedes desactivar “Confirm email” para demos)
5. Copia URL y anon key → `apps/web/.env`:

```bash
cp apps/web/.env.example apps/web/.env
# edita VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
```

6. En Vercel: mismas variables de entorno.

Login seed: `valencia@demo.local` / `demo1234`

## Local

```bash
npm install
npm run dev
```

Build: `npm run build` · servir: `npm start` o `Iniciar_Demo.bat`

## Flujo

| Pantalla | Función |
|----------|---------|
| **Buscar** | Código + estado → resultados → catálogo del local |
| **Soy repuestero** | Auth email, perfil, subir catálogo CSV (5 columnas) |

Portafolio UI antiguo: `/portfolio` tras el build.
