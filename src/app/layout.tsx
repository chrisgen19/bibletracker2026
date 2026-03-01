import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { SessionProvider } from "@/components/providers/session-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.AUTH_URL ?? "http://localhost:3000"),
  title: {
    default: "Sola Scriptura — Bible Reading Tracker",
    template: "%s | Sola Scriptura",
  },
  description:
    "Track your daily Bible reading, build streaks, and reflect on Scripture with a simple, beautiful journal.",
  openGraph: {
    type: "website",
    siteName: "Sola Scriptura",
    title: "Sola Scriptura — Bible Reading Tracker",
    description:
      "Track your daily Bible reading, build streaks, and reflect on Scripture with a simple, beautiful journal.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sola Scriptura — Bible Reading Tracker",
    description:
      "Track your daily Bible reading, build streaks, and reflect on Scripture with a simple, beautiful journal.",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>{children}</SessionProvider>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
