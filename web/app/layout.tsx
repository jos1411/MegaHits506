import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mega Hits 506 | Discomóvil y Animación de Eventos",
  description:
    "Discomóvil y animación de eventos en Pérez Zeledón. Bodas, quinceañeras, fiestas empresariales y más.",
  openGraph: {
    title: "Mega Hits 506 | Discomóvil y Animación de Eventos",
    description:
      "Discomóvil y animación de eventos en Pérez Zeledón. Bodas, quinceañeras, fiestas empresariales y más.",
    locale: "es_CR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
