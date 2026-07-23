/** Lee rol admin desde app_metadata de Supabase Auth. */
export function isAdminUser(user: {
  app_metadata?: Record<string, unknown> | null;
} | null | undefined): boolean {
  if (!user?.app_metadata) return false;
  return user.app_metadata.role === "admin";
}
