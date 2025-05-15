'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'

interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  category: string
  size: string
  condition: string
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      size: product.size,
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Link href={`/products/${product.id}`}>
        <div className="relative h-64">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        </Link>

        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">${product.price.toFixed(2)}</span>
          <span className="text-sm text-gray-500">Size: {product.size}</span>
        </div>

        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500">{product.category}</span>
          <span className="text-sm text-gray-500 capitalize">
            {product.condition}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
} 