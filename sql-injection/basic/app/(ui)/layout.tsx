import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/utils/provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HTB Style SQL Injection Track",
  description: "A progressive series of labs simulating Hack The Box style SQL injection challenges. Each lab builds on the last, guiding you through increasingly complex attack techniques to extract hidden flags and advance through the track.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>  
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} >
        <Providers>

        {children}
        </Providers>
      </body>
    </html>
  );
}
