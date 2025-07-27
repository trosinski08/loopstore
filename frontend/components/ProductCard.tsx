import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Heart } from 'lucide-react';
import { useState } from 'react';

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
  stock: number;
  category: Category;
  quantity?: number;
  slug: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface ProductCardProps {
  product: Product;
  showDescription?: boolean;
}

export default function ProductCard({ product, showDescription = true }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isWishListed, setIsWishListed] = useState(false);
  const [imgError, setImgError] = useState(false);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishListed(!isWishListed);
  };

  return (
    <Link href={`/products/${product.id}`}>
      <div className="group bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
        <div className="relative aspect-square">
          <Image
            src={imgError ? '/images/placeholder.jpg' : (product.image || '/images/placeholder.jpg')}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            onError={() => setImgError(true)}
          />
          <button
            onClick={toggleWishlist}
            className={`absolute top-2 right-2 p-2 rounded-full ${
              isWishListed ? 'bg-red-500 text-white' : 'bg-white text-gray-600'
            }`}
          >
            <Heart size={20} fill={isWishListed ? 'currentColor' : 'none'} />
          </button>
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <span className="text-sm text-gray-500">{product.category.name}</span>
          </div>
          {showDescription && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {product.description}
            </p>
          )}
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">${Number(product.price).toFixed(2)}</span>
            <button
              onClick={(e) => {
                e.preventDefault();
                addToCart({...product, quantity: 1});
              }}
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
              disabled={product.stock === 0}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}