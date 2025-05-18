'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Filter, SlidersHorizontal } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  quantity: number;
  category: string;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const { addToCart } = useCart();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'all',
    priceRange: 'all',
    sortBy: 'newest'
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/products/');
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = ['all', 'tops', 'bottoms', 'accessories'];
  const priceRanges = [
    { label: 'All', value: 'all' },
    { label: 'Under $50', value: '0-50' },
    { label: '$50 - $100', value: '50-100' },
    { label: 'Over $100', value: '100-up' }
  ];
  const sortOptions = [
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' }
  ];

  const filterProducts = (products: Product[]) => {
    let filtered = [...products];

    // Apply category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(p => p.category.toLowerCase() === filters.category);
    }

    // Apply price range filter
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(p => {
        if (max) {
          return p.price >= min && p.price <= max;
        }
        return p.price >= min;
      });
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
      default:
        // Assuming products are already sorted by newest
        break;
    }

    return filtered;
  };

  const filteredProducts = filterProducts(products);

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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Shop</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden flex items-center gap-2 text-gray-600"
        >
          <Filter size={20} />
          Filters
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters - Desktop */}
        <div className={`lg:w-1/4 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setFilters({ ...filters, category })}
                  className={`block w-full text-left px-4 py-2 rounded-md ${
                    filters.category === category
                      ? 'bg-black text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Price Range</h3>
            <div className="space-y-2">
              {priceRanges.map(range => (
                <button
                  key={range.value}
                  onClick={() => setFilters({ ...filters, priceRange: range.value })}
                  className={`block w-full text-left px-4 py-2 rounded-md ${
                    filters.priceRange === range.value
                      ? 'bg-black text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:w-3/4">
          {/* Sort */}
          <div className="flex justify-end mb-6">
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Products */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group">
                <Link href={`/shop/${product.id}`}>
                  <div className="relative aspect-square overflow-hidden bg-gray-100 mb-4">
                    <Image
                      src={product.image || '/images/placeholder.jpg'}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-2">${product.price}</p>
                </Link>
                <button
                  onClick={() => addToCart(product)}
                  className="w-full btn btn-primary py-2"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 