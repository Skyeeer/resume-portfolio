import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FirebaseAnalytics } from "@/components/firebase-analytics";
import { Header } from "@/components/header";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Charlie Ålander | Fullstack Javascript Developer",
  description: "Personal portfolio of Charlie Ålander, a Fullstack Javascript Developer based in Stockholm, Sweden. Showcasing development skills, projects, and professional experience.",
  keywords: ["Charlie Ålander", "Web Developer", "Fullstack Developer", "JavaScript", "React", "Next.js", "Frontend", "Backend", "Stockholm", "Sweden"],
  authors: [{ name: "Charlie Ålander" }],
  creator: "Charlie Ålander",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.skyeeer.com/",
    title: "Charlie Ålander | Fullstack Javascript Developer",
    description: "Personal portfolio of Charlie Ålander, a Fullstack Javascript Developer based in Stockholm, Sweden.",
    siteName: "Charlie Ålander",
  },
  twitter: {
    card: "summary_large_image",
    title: "Charlie Ålander | Fullstack Javascript Developer",
    description: "Personal portfolio of Charlie Ålander, a Fullstack Javascript Developer based in Stockholm, Sweden.",
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
  },
  robots: {
    index: true,
    follow: true,
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
        <Header />
        {children}
        <Suspense fallback={null}>
          <FirebaseAnalytics />
        </Suspense>
      </body>
    </html>
  );
}
