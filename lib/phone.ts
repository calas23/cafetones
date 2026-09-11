// Téléphone : conversion en href tel: (portée de l'ancien js/main.js).

export function telHref(phone: string): string {
  const digits = phone.replace(/[\s\-.()]/g, "");
  if (digits.startsWith("+")) return `tel:${digits}`;
  if (digits.startsWith("0")) return `tel:+33${digits.slice(1)}`;
  return `tel:${digits}`;
}
