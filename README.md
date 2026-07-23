# BuscaRepuesto (programa — nicho automotriz)

Directorio multi-local de **repuestos automotrices**: busca código → locales con teléfono / WhatsApp. **100% gratis · sin membresía.** El activo es la base de datos (`dealers` + `listings`).

> No es un directorio de rodamientos industriales.

## Monorepo

```text
apps/web              # Vite + React (UI)
packages/shared       # tipos, CSV, estados, búsqueda
supabase/             # migraciones + seed (solo dev)
```

## Setup Supabase

1. Crea un proyecto en https://supabase.com
2. SQL Editor → ejecuta en orden:
   - `supabase/migrations/001_init.sql`
   - `supabase/migrations/002_dealers_user_id_admin.sql`
3. (Opcional, solo entornos vacíos) `supabase/seed.sql`
4. Authentication → Email: activa; para operar rápido, desactiva “Confirm email”
5. Copia URL y **anon** key → `apps/web/.env`:

```bash
cp apps/web/.env.example apps/web/.env
# VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
```

6. Vercel: mismas variables (Production + Preview) y redeploy.

### Rol operador (obligatorio para llenar BD)

1. Crea tu usuario (registro normal o Auth → Users → Invite/Add).
2. Authentication → Users → tu usuario → **Raw App Meta Data**:

```json
{"role":"admin"}
```

3. Abre la app en `#operador` (ej. `https://tu-dominio/#operador`), entra con ese email/clave.
4. Importa CSV de **locales** y luego de **catálogo** (Excel → Guardar como CSV).

Plantillas en la pantalla Operador.

## Local

```bash
npm install
npm run dev
```

Build: `npm run build`

## Flujo

| Pantalla | Función |
|----------|---------|
| **Buscar** | Código + estado → Llamar / WhatsApp → catálogo del local |
| **Soy repuestero** | Registro gratis + CSV (canal secundario) |
| **Operador** (`#operador`) | Tú llenas la BD a granel (admin) |

## Smoke checklist

1. Migración `002` aplicada y `role: admin` en tu user.
2. Operador: importar 1 local + códigos → stats suben.
3. Buscar un código → Llamar / WhatsApp abren.
4. Redeploy Vercel tras cambios de código (env Vite se hornea en build).
