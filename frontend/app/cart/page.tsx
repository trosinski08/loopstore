'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { Trash2 } from 'lucide-react'

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, total, clearCart } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  })

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return
    updateQuantity(id, newQuantity)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckout = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postal_code: formData.postalCode,
          country: formData.country,
          items: cartItems.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      })

      if (!response.ok) throw new Error('Failed to create order')

      // Clear cart and show success message
      clearCart()
      alert('Order placed successfully!')
      setIsCheckingOut(false)
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Failed to place order. Please try again.')
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <p>Your cart is empty.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {!isCheckingOut ? (
        <>
          {/* Cart Items */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            {cartItems.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className="flex items-center py-4 border-b last:border-b-0"
              >
                <div className="relative h-24 w-24 flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>

                <div className="ml-4 flex-grow">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600">Size: {item.size}</p>
                  <p className="text-gray-600">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity - 1)
                      }
                      className="px-2 py-1 border rounded"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }
                      className="px-2 py-1 border rounded"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}

            <div className="mt-6 text-right">
              <p className="text-xl font-semibold">
                Total: ${total.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Checkout Button */}
          <div className="text-right">
            <button
              onClick={() => setIsCheckingOut(true)}
              className="bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      ) : (
        /* Checkout Form */
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Shipping Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2"
                required
              />
            </div>

            <div className="mt-8 space-x-4">
              <button
                onClick={handleCheckout}
                className="bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-colors"
              >
                Place Order
              </button>
              <button
                onClick={() => setIsCheckingOut(false)}
                className="bg-gray-200 text-gray-800 py-3 px-6 rounded-md hover:bg-gray-300 transition-colors"
              >
                Back to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 