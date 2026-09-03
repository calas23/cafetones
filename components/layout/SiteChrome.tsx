"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

// Masque header/footer sur la page hôte de Plasmic Studio (/plasmic-host),
// qui ne doit contenir que le canvas d'édition.
export function SiteChrome({ header, footer, children }: { header: ReactNode; footer: ReactNode; children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/plasmic-host") return <>{children}</>;
  return (
    <>
      {header}
      {children}
      {footer}
    </>
  );
}
