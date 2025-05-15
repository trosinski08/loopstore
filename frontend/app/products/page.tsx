'use client'

import { useState, useEffect } from 'react'
import ProductCard from '@/components/ProductCard'
import ProductFilter from '@/components/ProductFilter'
import { useSearchParams } from 'next/navigation'

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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const category = searchParams?.get('category')
        const size = searchParams?.get('size')
        const condition = searchParams?.get('condition')
        const minPrice = searchParams?.get('minPrice')
        const maxPrice = searchParams?.get('maxPrice')

        let url = 'http://localhost:8000/api/products/?'
        if (category) url += `category=${category}&`
        if (size) url += `size=${size}&`
        if (condition) url += `condition=${condition}&`
        if (minPrice) url += `min_price=${minPrice}&`
        if (maxPrice) url += `max_price=${maxPrice}&`

        const response = await fetch(url)
        if (!response.ok) throw new Error('Failed to fetch products')
        const data = await response.json()
        setProducts(data.results)
      } catch (err) {
        setError('Failed to load products')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [searchParams])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters */}
        <div className="w-full md:w-1/4">
          <ProductFilter />
        </div>

        {/* Product Grid */}
        <div className="w-full md:w-3/4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-8">
              No products found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 