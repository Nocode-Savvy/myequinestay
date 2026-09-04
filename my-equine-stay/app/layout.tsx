import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/ui/app-shell";

export const metadata: Metadata = {
  title: {
    default: "My Equine Stay — Ocala equestrian stays, owner-direct",
    template: `%s — My Equine Stay`,
  },
  description:
    "Find farms, barns, RV hookups and homes for horse travelers in Ocala. Contact property owners directly — no booking fees.",
  keywords: [
    "equestrian stays Florida",
    "horse-friendly rentals Ocala",
    "barn rental near WEC",
    "equestrian Airbnb Ocala",
    "horse farm rental Florida",
    "WEC accommodations Ocala",
    "HITS Ocala lodging",
    "horse stall rental Florida",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  authors: [{ name: "My Equine Stay" }],
  openGraph: {
    title: "My Equine Stay — Ocala equestrian stays, owner-direct",
    description:
      "Find farms, barns, RV hookups and homes for horse travelers in Ocala. Contact property owners directly — no booking fees.",
    type: "website",
    locale: "en_US",
    siteName: "My Equine Stay",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "My Equine Stay — Find Your Equine Stay in Ocala FL",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "My Equine Stay — Ocala equestrian stays, owner-direct",
    description:
      "Find farms, barns, RV hookups and homes for horse travelers in Ocala. Contact property owners directly — no booking fees.",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1B221E]"
        suppressHydrationWarning
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
