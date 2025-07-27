'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Filter, SortAsc, SortDesc } from 'lucide-react';
import { getMediaUrl } from '@/src/utils/mediaUrl';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent: number | null;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: Category | null;
  stock: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
  });
  const [sortBy, setSortBy] = useState<'price' | 'name'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { addToCart } = useCart();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api';
        const res = await fetch(`${baseApiUrl}/products`, {
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error('Error response:', errorText);
          throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
        }
        
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          throw new Error('Invalid data format received from API');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to load products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api';
        const res = await fetch(`${baseApiUrl}/categories`, {
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error('Categories error response:', errorText);
          throw new Error(`Failed to fetch categories: ${res.status} ${res.statusText}`);
        }
        
        const data = await res.json();
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          throw new Error('Invalid category data format received from API');
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleSort = (field: 'price' | 'name') => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const filteredAndSortedProducts = products
    .filter(product => {
      if (filters.category && product.category?.slug !== filters.category) return false;
      if (filters.minPrice && product.price < Number(filters.minPrice)) return false;
      if (filters.maxPrice && product.price > Number(filters.maxPrice)) return false;
      return true;
    })
    .sort((a, b) => {
      const order = sortOrder === 'asc' ? 1 : -1;
      if (sortBy === 'price') {
        return (a.price - b.price) * order;
      }
      return a.name.localeCompare(b.name) * order;
    });

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
      {/* Filters */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="form-select"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleFilterChange}
            placeholder="Min Price"
            className="form-input"
          />
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            placeholder="Max Price"
            className="form-input"
          />
          <button
            onClick={() => toggleSort('name')}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-md shadow-sm"
          >
            Name {sortBy === 'name' && (sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />)}
          </button>
          <button
            onClick={() => toggleSort('price')}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-md shadow-sm"
          >
            Price {sortBy === 'price' && (sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />)}
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredAndSortedProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative aspect-square">
              <Image
                src={getMediaUrl(product.image)}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-2">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">${product.price}</span>
                <button
                  onClick={() => addToCart({ ...product, quantity: 1 })}
                  className="btn btn-primary px-4 py-2"
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAndSortedProducts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}