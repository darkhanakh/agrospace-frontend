import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Import Inter font from Google
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

// Google Inter font
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AgroSpace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
