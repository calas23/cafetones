"use client";

import { useEffect } from "react";

// Bascule tableau desktop / cartes mobiles — port du script inline de
// l'ancienne page cafe-bureau-entreprise.html (seuil 768px + resize).
export function PricingToggle() {
  useEffect(() => {
    const table = document.getElementById("pricing-table-desktop");
    const cards = document.getElementById("pricing-cards-mobile");
    if (!table || !cards) return;

    function togglePricing() {
      if (!table || !cards) return;
      if (window.innerWidth >= 768) {
        table.style.display = "block";
        cards.style.display = "none";
      } else {
        table.style.display = "none";
        cards.style.display = "grid";
      }
    }

    togglePricing();
    window.addEventListener("resize", togglePricing);
    return () => window.removeEventListener("resize", togglePricing);
  }, []);

  return null;
}
