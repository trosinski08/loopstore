import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Layout from "@/components/layout/Layout";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LOOPS - Upcycled Fashion Store",
  description: "Discover unique upcycled fashion pieces at LOOPS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <Layout>{children}</Layout>
        </CartProvider>
      </body>
    </html>
  );
}