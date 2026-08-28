import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopNav from "@/components/nav/TopNav";
import Footer from "@/components/nav/Footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VacancyRatio — Graduate vs Vacancy Intelligence",
  description:
    "Understand the relationship between graduates and job vacancies across fields and countries.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-neutral-50 font-sans antialiased`}
      >
        <TopNav />
        <main className="mx-auto max-w-6xl px-4 py-12 sm:px-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
