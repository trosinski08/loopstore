'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { getMediaUrl } from '@/lib/utils';
import SearchBar from '@/components/SearchBar';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  category?: string;
}

export default function SearchPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  
  const query = searchParams?.get('q') || '';

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api';
        const res = await fetch(`${baseApiUrl}/products/search/?q=${encodeURIComponent(query)}`);
        
        if (!res.ok) {
          throw new Error('Failed to fetch search results');
        }
        
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching search results:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Search Results</h1>
      
      <div className="mb-8 max-w-xl">
        <SearchBar className="w-full" />
      </div>
      
      {query && (
        <p className="text-gray-600 mb-6">
          {loading ? 'Searching...' : `${products.length} results for "${query}"`}
        </p>
      )}
      
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-xl text-gray-600 mb-4">
            {query ? 'No products found matching your search.' : 'Enter a search term to find products.'}
          </p>
          <Link href="/shop" className="btn btn-primary px-6 py-2">
            Browse All Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group">
              <Link href={`/product/${product.id}`} className="block">
                <div className="relative aspect-square overflow-hidden bg-gray-100 mb-4">
                  <Image
                    src={getMediaUrl(product.image)}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                  />
                </div>
                <h3 className="font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-2">${product.price}</p>
                {product.category && (
                  <p className="text-sm text-gray-500 mb-2">
                    Category: {product.category}
                  </p>
                )}
              </Link>
              <button
                onClick={() => addToCart({ ...product, quantity: 1 })}
                className="w-full btn btn-primary py-2"
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
