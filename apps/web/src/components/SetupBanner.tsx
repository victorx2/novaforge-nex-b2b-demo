export function SetupBanner() {
  return (
    <div className="setup-banner">
      <strong>Falta conectar Supabase.</strong> Crea un proyecto en supabase.com,
      ejecuta <code>supabase/migrations/001_init.sql</code> y{" "}
      <code>supabase/seed.sql</code>, luego define{" "}
      <code>VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_ANON_KEY</code> en{" "}
      <code>apps/web/.env</code> (ver <code>.env.example</code>).
    </div>
  );
}
