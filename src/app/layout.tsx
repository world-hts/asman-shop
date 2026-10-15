import type { Metadata } from "next";
import "./globals.css";
import { PwaRegister } from "@/components/PwaRegister";
import { getSiteUrl } from "@/lib/site";

const siteUrl = getSiteUrl();
const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "Asman Shop";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${storeName} — Telefon we aksessuarlar`, template: `%s — ${storeName}` },
  description: "Asman Shop — telefonlar, aksessuarlar we gündelik elektronika. Türkmençe, rusça we iňlisçe önüm katalogy.",
  applicationName: storeName,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/icon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/icons/icon-192.png",
  },
  openGraph: {
    type: "website",
    title: `${storeName} — Telefon we aksessuarlar`,
    description: "Asman Shop — telefonlar, aksessuarlar we gündelik elektronika. Türkmençe, rusça we iňlisçe önüm katalogy.",
    siteName: storeName,
  },
  twitter: { card: "summary", title: `${storeName} — Telefon we aksessuarlar`, description: "Asman Shop — telefonlar, aksessuarlar we gündelik elektronika. Türkmençe, rusça we iňlisçe önüm katalogy." },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#40c7f2",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tk" data-scroll-behavior="smooth">
      <body>
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
