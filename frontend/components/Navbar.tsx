import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { ShoppingBag, Search } from 'lucide-react'

const Navbar = () => {
  const { cartItems } = useCart()

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold">
            Upcycled Fashion
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link href="/products" className="hover:text-gray-600">
              All Products
            </Link>
            <Link href="/categories" className="hover:text-gray-600">
              Categories
            </Link>
            <Link href="/about" className="hover:text-gray-600">
              About
            </Link>
          </div>

          {/* Search and Cart */}
          <div className="flex items-center space-x-4">
            <button className="hover:text-gray-600">
              <Search size={20} />
            </button>
            <Link href="/cart" className="relative hover:text-gray-600">
              <ShoppingBag size={20} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 