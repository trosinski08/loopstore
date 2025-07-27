"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { getMediaUrl } from "@/lib/utils";
import ProductFilter from "@/components/ProductFilter";
import { HeartIcon as HeartOutlineIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  quantity: number;
  category?: string;
}

function ShopComponent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const searchParams = useSearchParams();
  
  // Get all search params
  const category = searchParams?.get("category");
  const size = searchParams?.get("size");
  const minPrice = searchParams?.get("min_price");
  const maxPrice = searchParams?.get("max_price");
  const sort = searchParams?.get("sort");
  const search = searchParams?.get("search");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api';
        
        // Build query string with all params
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (size) params.append('size', size);
        if (minPrice) params.append('min_price', minPrice);
        if (maxPrice) params.append('max_price', maxPrice);
        if (sort) params.append('sort', sort);
        if (search) params.append('search', search);
        
        const queryString = params.toString();
        const url = `${baseApiUrl}/products/${queryString ? `?${queryString}` : ''}`;
        
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, size, minPrice, maxPrice, sort, search]);
  const handleToggleFavorite = async (product: Product) => {
    if (!isAuthenticated) {
      alert('Please sign in to save products to your favorites');
      return;
    }
    
    if (isFavorite(product.id)) {
      await removeFromFavorites(product.id);
    } else {
      await addToFavorites(product);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  // Determine page title based on filters
  const getPageTitle = () => {
    if (search) return `Search Results: "${search}"`;
    if (category) return `${category.charAt(0).toUpperCase() + category.slice(1)}`;
    return "All Products";
  };

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8">{getPageTitle()}</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filter Sidebar */}
        <div className="md:w-1/4">
          <ProductFilter />
        </div>
        
        {/* Products Grid */}
        <div className="md:w-3/4">
          {products.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <p className="text-xl text-gray-600 mb-4">No products found</p>
              <p className="text-gray-500">Try adjusting your filters or search term</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
                  <Link href={`/product/${product.id}`} className="block">
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <Image
                        src={getMediaUrl(product.image)}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                      />
                    </div>
                  </Link>
                  
                  <div className="p-4">
                    <Link href={`/product/${product.id}`} className="block">
                      <h3 className="font-semibold mb-1 hover:underline">{product.name}</h3>
                    </Link>
                    <p className="text-gray-500 text-sm mb-2 line-clamp-2">{product.description}</p>
                    
                    <div className="flex justify-between items-center mt-4">
                      <span className="font-bold">${product.price}</span>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleToggleFavorite(product)}
                          className={`p-2 rounded-full transition ${
                            isFavorite(product.id) 
                              ? 'text-red-500 hover:bg-red-50' 
                              : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                          }`}
                          aria-label={isFavorite(product.id) ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          {isFavorite(product.id) ? (
                            <HeartSolidIcon className="h-5 w-5" />
                          ) : (
                            <HeartOutlineIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full btn btn-primary py-2 mt-2"
                      disabled={product.stock === 0}
                    >
                      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShopComponent />
    </Suspense>
  );
}