// Téléphone : conversion en href tel: et SVG anti-scraping,
// porté à l'identique de l'ancien js/main.js (renderPhoneNumbers).

export function telHref(phone: string): string {
  const digits = phone.replace(/[\s\-.()]/g, "");
  if (digits.startsWith("+")) return `tel:${digits}`;
  if (digits.startsWith("0")) return `tel:+33${digits.slice(1)}`;
  return `tel:${digits}`;
}

// Génère exactement la même chaîne SVG que l'ancien renderPhoneNumbers().
export function phoneSvg(phone: string, isLarge: boolean): string {
  const fontSize = isLarge ? 26 : 16;
  const height = isLarge ? "1.8em" : "1.2em";
  const viewWidth = isLarge ? 220 : 160;
  const viewHeight = isLarge ? 34 : 22;
  const yPos = isLarge ? 26 : 17;
  return (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + viewWidth + " " + viewHeight +
    '" style="height:' + height + ';vertical-align:middle;display:inline-block;width:auto;">' +
    '<text x="0" y="' + yPos + '" fill="currentColor" font-family="\'DM Sans\',sans-serif" font-size="' +
    fontSize + '" font-weight="600">' + phone + "</text></svg>"
  );
}
