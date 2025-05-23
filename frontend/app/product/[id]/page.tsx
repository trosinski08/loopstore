'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useAuth } from '@/context/AuthContext';
import { getMediaUrl } from '@/lib/utils';
import Reviews from '@/components/product/Reviews';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';

interface Review {
  id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  reviews?: Review[];
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const [isInFavorites, setIsInFavorites] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.id}/`);
        if (!res.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  useEffect(() => {
    if (product) {
      setIsInFavorites(isFavorite(product.id));
    }
  }, [product, isFavorite]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error || 'Product not found'}</div>
      </div>
    );
  }
  const handleAddToCart = () => {
    if (product.stock > 0) {
      addToCart({ ...product, quantity: 1 });
      // You might want to show a toast notification here instead of an alert
      alert('Product added to cart successfully!');
    } else {
      alert('Product is out of stock');
    }
  };
  
  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      alert('Please log in to add items to your favorites');
      return;
    }
    
    if (isInFavorites) {
      const success = await removeFromFavorites(product.id);
      if (success) {
        setIsInFavorites(false);
      }
    } else {
      const success = await addToFavorites(product);
      if (success) {
        setIsInFavorites(true);
      }
    }
  };
  return (
    <div className="container py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={getMediaUrl(product.image)}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>
            <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">${product.price}</span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-grow btn btn-primary py-3"
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              
              <button 
                onClick={toggleFavorite}
                className={`px-4 py-3 border rounded-md transition ${
                  isInFavorites 
                    ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
                aria-label={isInFavorites ? 'Remove from favorites' : 'Add to favorites'}
              >
                {isInFavorites ? (
                  <HeartIconSolid className="h-5 w-5" />
                ) : (
                  <HeartIconOutline className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Reviews Section */}
      <Reviews 
        productId={parseInt(params.id)} 
        initialReviews={product.reviews || []} 
      />
    </div>
  );
} 