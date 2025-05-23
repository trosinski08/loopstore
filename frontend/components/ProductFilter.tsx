import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent?: number | null;
}

interface Size {
  id: number;
  name: string;
}

export default function ProductFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [priceRange, setPriceRange] = useState({
    min: searchParams?.get('min_price') || '',
    max: searchParams?.get('max_price') || ''
  });
  
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams?.get('category') || ''
  );
  
  const [selectedSizes, setSelectedSizes] = useState<string[]>(() => {
    const sizeParam = searchParams?.get('size');
    return sizeParam ? sizeParam.split(',') : [];
  });
  
  const [sortBy, setSortBy] = useState(
    searchParams?.get('sort') || 'newest'
  );

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        setLoading(true);
        const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api';
        
        // Fetch categories
        const categoriesRes = await fetch(`${baseApiUrl}/categories/`);
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData);
        }
        
        // Fetch sizes
        const sizesRes = await fetch(`${baseApiUrl}/sizes/`);
        if (sizesRes.ok) {
          const sizesData = await sizesRes.json();
          setSizes(sizesData);
        }
      } catch (error) {
        console.error('Error fetching filter data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterData();
  }, []);
  
  const applyFilters = () => {
    const params = new URLSearchParams();
    
    if (selectedCategory) {
      params.set('category', selectedCategory);
    }
    
    if (selectedSizes.length > 0) {
      params.set('size', selectedSizes.join(','));
    }
    
    if (priceRange.min) {
      params.set('min_price', priceRange.min);
    }
    
    if (priceRange.max) {
      params.set('max_price', priceRange.max);
    }
    
    if (sortBy) {
      params.set('sort', sortBy);
    }
    
    router.push(`${pathname}?${params.toString()}`);
  };
  
  const resetFilters = () => {
    setPriceRange({ min: '', max: '' });
    setSelectedCategory('');
    setSelectedSizes([]);
    setSortBy('newest');
    if (pathname) {
      router.push(pathname);
    }
  };
  
  const handleSizeToggle = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };
  
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button 
          onClick={resetFilters}
          className="text-sm text-gray-500 hover:text-black flex items-center"
        >
          <XMarkIcon className="w-4 h-4 mr-1" />
          Reset All
        </button>
      </div>
      
      {/* Categories */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Category</h3>
        <div className="space-y-1">
          <div className="flex items-center">
            <input
              type="radio"
              id="category-all"
              name="category"
              checked={selectedCategory === ''}
              onChange={() => setSelectedCategory('')}
              className="mr-2"
            />
            <label htmlFor="category-all" className="text-sm">All Categories</label>
          </div>
          
          {categories.map(category => (
            <div key={category.id} className="flex items-center">
              <input
                type="radio"
                id={`category-${category.slug}`}
                name="category"
                checked={selectedCategory === category.slug}
                onChange={() => setSelectedCategory(category.slug)}
                className="mr-2"
              />
              <label htmlFor={`category-${category.slug}`} className="text-sm">{category.name}</label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Price Range */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Price Range</h3>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
            className="w-1/2 p-2 text-sm border border-gray-300 rounded"
            min="0"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
            className="w-1/2 p-2 text-sm border border-gray-300 rounded"
            min="0"
          />
        </div>
      </div>
      
      {/* Sizes */}
      {sizes.length > 0 && (
        <div className="mb-6">
          <h3 className="font-medium mb-2">Size</h3>
          <div className="flex flex-wrap gap-2">
            {sizes.map(size => (
              <button
                key={size.id}
                onClick={() => handleSizeToggle(size.name)}
                className={`px-3 py-1 text-sm border rounded-md ${
                  selectedSizes.includes(size.name)
                    ? 'bg-black text-white border-black'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {size.name}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Sort By */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Sort By</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full p-2 text-sm border border-gray-300 rounded"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name">Name</option>
        </select>
      </div>
      
      <button
        onClick={applyFilters}
        className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
      >
        Apply Filters
      </button>
    </div>
  );
}