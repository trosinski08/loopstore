"use client";

import { useEffect } from "react";
import { useFavorites } from "@/context/FavoritesContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getMediaUrl } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { HeartIcon, ShoppingBagIcon } from "@heroicons/react/24/solid";

export default function FavoritesPage() {
  const { favorites, removeFromFavorites, isLoading } = useFavorites();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  const handleRemoveFromFavorites = async (productId: number) => {
    await removeFromFavorites(productId);
  };

  const handleAddToCart = (product: any) => {
    addToCart({ ...product, quantity: 1 });
    // You could add a toast notification here
    alert("Product added to cart!");
  };

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">My Favorites</h1>

      {favorites.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-gray-600 mb-4">You don't have any favorite products yet.</p>
          <Link href="/shop" className="btn btn-primary px-6 py-2">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((product) => (
            <div 
              key={product.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition"
            >
              <Link href={`/product/${product.id}`} className="block">
                <div className="relative aspect-square">
                  <Image
                    src={getMediaUrl(product.image)}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              </Link>
              
              <div className="p-4">
                <Link href={`/product/${product.id}`} className="block">
                  <h2 className="text-lg font-semibold mb-2 hover:underline">{product.name}</h2>
                </Link>
                <p className="text-gray-500 text-sm mb-2 line-clamp-2">{product.description}</p>
                
                <div className="flex justify-between items-center mt-4">
                  <span className="text-lg font-bold">${product.price}</span>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRemoveFromFavorites(product.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full transition"
                      aria-label="Remove from favorites"
                    >
                      <HeartIcon className="h-6 w-6" />
                    </button>
                    
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock <= 0}
                      className={`p-2 rounded-full transition ${
                        product.stock > 0 
                          ? 'text-black hover:bg-gray-100' 
                          : 'text-gray-400 cursor-not-allowed'
                      }`}
                      aria-label="Add to cart"
                    >
                      <ShoppingBagIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>
                
                {product.stock <= 0 && (
                  <p className="text-red-500 text-sm mt-2">Out of stock</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
