import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "THE LET DOWN ARCHIVE",
  description:
    "Fifteen recordings. One song. A digital archive of the performances, demos, alternate versions and interpretations of Radiohead's Let Down.",
  applicationName: "The Let Down Archive",
  keywords: ["Let Down", "Radiohead", "music archive", "demo", "live recording"],
  openGraph: {
    title: "THE LET DOWN ARCHIVE",
    description: "15 recordings. One song. An archive of a song, and everything it became.",
    type: "website",
    images: [
      {
        url: "/images/landing/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "A lone figure at the end of a rain-soaked street at dusk",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "THE LET DOWN ARCHIVE",
    description: "15 recordings. One song.",
    images: ["/images/landing/og-image.jpg"],
  },
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#111110",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} ${plexMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
