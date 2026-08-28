import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopNav from "@/components/nav/TopNav";
import Footer from "@/components/nav/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "VacancyRatio — Graduate vs Vacancy Intelligence",
    template: "%s — VacancyRatio",
  },
  description:
    "Understand the relationship between the number of people graduating into a field and the number of relevant job vacancies available. Data-driven graduate market intelligence.",
  openGraph: {
    siteName: "VacancyRatio",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-neutral-50">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-neutral-50 font-sans antialiased`}
      >
        <TopNav />
        <main className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
