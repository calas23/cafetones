// Numéro de téléphone en texte normal : il suit la police, la taille et la couleur de son
// contexte et se centre comme n'importe quel texte. (L'ancien site le dessinait en SVG
// anti-spam, ce qui figeait la police et décalait le numéro dans son cadre.)
export function PhoneText({ phone, large = false }: { phone: string; large?: boolean }) {
  const className = large ? "phone-text phone-text--lg" : "phone-text";
  return <span className={className}>{phone}</span>;
}
