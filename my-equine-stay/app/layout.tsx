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
  authors: [{ name: "My Equine Stay" }],
  openGraph: {
    title: "My Equine Stay — Ocala equestrian stays, owner-direct",
    description:
      "Find farms, barns, RV hookups and homes for horse travelers in Ocala. Contact property owners directly — no booking fees.",
    type: "website",
    locale: "en_US",
    siteName: "My Equine Stay",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Equine Stay — Ocala equestrian stays, owner-direct",
    description:
      "Find farms, barns, RV hookups and homes for horse travelers in Ocala. Contact property owners directly — no booking fees.",
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
