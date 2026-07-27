import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} | Discomóvil y Animación de Eventos`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: `${SITE_NAME} | Discomóvil y Animación de Eventos`,
    description: SITE_DESCRIPTION,
    locale: "es_CR",
    type: "website",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Discomóvil y Animación de Eventos`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  telephone: "+506XXXXXXXX",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Pérez Zeledón",
    addressRegion: "San José",
    addressCountry: "CR",
  },
  sameAs: ["#", "#", "#"],
  areaServed: "Pérez Zeledón, Costa Rica",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
