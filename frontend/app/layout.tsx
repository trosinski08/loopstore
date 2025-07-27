import type { Metadata } from "next";
// import { Inter } from "next/font/google"; // Comment out Google Font import
import "./globals.css";
import Layout from "@/components/layout/Layout";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { FavoritesProvider } from "@/context/FavoritesContext";

// const inter = Inter({ subsets: ["latin"] }); // Comment out Google Font initialization

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
      {/* <body className={inter.className}> */}
      {/* Use a default font stack instead of Inter */}
      <body className="font-sans">
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>
              <Layout>{children}</Layout>
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}