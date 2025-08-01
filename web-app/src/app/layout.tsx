import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import GlobalProvider from "@/providers/GlobalProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pluma Web",
  description: "Read, Write, Share thoughts",
  icons: {
    icon: "/pluma_icon.png",
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
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <GlobalProvider>
          <SiteHeader />
          {children}
          <Footer />
        </GlobalProvider>
      </body>
    </html>
  );
}
