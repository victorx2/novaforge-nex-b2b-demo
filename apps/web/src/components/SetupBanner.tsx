export function SetupBanner() {
  return (
    <div className="setup-banner">
      <strong>Falta conectar Supabase.</strong> Define{" "}
      <code>VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_ANON_KEY</code> en{" "}
      <code>apps/web/.env</code> (ver <code>.env.example</code>).
    </div>
  );
}
