/** Dígitos de un teléfono VE (sin +58 / 0 inicial para wa.me). */
export function phoneDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}

/** Clave estable para merge/upsert por teléfono. */
export function normalizePhoneKey(phone: string): string {
  let d = phoneDigits(phone);
  if (d.startsWith("58") && d.length >= 12) d = d.slice(2);
  if (d.startsWith("0") && d.length >= 11) d = d.slice(1);
  return d;
}

/** tel: href usable en móviles. */
export function telHref(phone: string): string {
  const d = phoneDigits(phone);
  if (!d) return `tel:${phone}`;
  if (d.startsWith("58")) return `tel:+${d}`;
  if (d.startsWith("0")) return `tel:+58${d.slice(1)}`;
  if (d.length === 10) return `tel:+58${d}`;
  return `tel:${phone}`;
}

/** wa.me con código país VE. */
export function whatsappHref(phone: string, text?: string): string {
  let d = phoneDigits(phone);
  if (!d) return "#";
  if (d.startsWith("0")) d = `58${d.slice(1)}`;
  else if (!d.startsWith("58") && d.length === 10) d = `58${d}`;
  const base = `https://wa.me/${d}`;
  if (!text) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
}
