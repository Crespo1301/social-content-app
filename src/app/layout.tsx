import type { Metadata } from "next";
import { Manrope, Newsreader } from "next/font/google";
import { CookieBanner } from "@/components/app/cookie-banner";
import { ThemeProvider } from "@/components/app/theme-provider";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Social Vault | CSolutions",
  description:
    "Private mobile-friendly Social Vault for storing, filtering, searching, and copying social captions across personal and business accounts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${newsreader.variable}`}>
      <body>
        <ThemeProvider>
          {children}
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
