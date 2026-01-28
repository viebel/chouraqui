import type { Metadata } from "next";
import { Geist, Geist_Mono, Frank_Ruhl_Libre } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const frankRuhlLibre = Frank_Ruhl_Libre({
  variable: "--font-hebrew",
  subsets: ["hebrew"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "La Bible de Chouraqui",
  description:
    "Affichage de la Bible en hébreu et en français avec les traductions d'André Chouraqui.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${frankRuhlLibre.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
