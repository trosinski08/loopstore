'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

interface Order {
  id: number;
  created_at: string;
  total: number;
  status: string;
  shipping_details: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: {
    id: number;
    product_name: string;
    quantity: number;
    price: number;
  }[];
}

export default function OrderConfirmationPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api';
        const res = await fetch(`${baseApiUrl}/orders/${params.id}/`, {
          credentials: 'include'
        });
        
        if (!res.ok) {
          throw new Error('Failed to fetch order details');
        }
        
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container py-12">
        <div className="max-w-2xl mx-auto bg-red-50 p-6 rounded-lg">
          <h1 className="text-2xl font-bold text-red-700 mb-4">Error</h1>
          <p className="text-red-600 mb-6">{error || 'Order not found'}</p>
          <Link href="/" className="btn btn-primary px-6 py-2">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been received.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Order Information</h2>
              <p><span className="text-gray-600">Order Number:</span> #{order.id}</p>
              <p><span className="text-gray-600">Date:</span> {new Date(order.created_at).toLocaleDateString()}</p>
              <p><span className="text-gray-600">Status:</span> {order.status}</p>
              <p><span className="text-gray-600">Total:</span> ${order.total.toFixed(2)}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Shipping Information</h2>
              <p>{order.shipping_details.firstName} {order.shipping_details.lastName}</p>
              <p>{order.shipping_details.address}</p>
              <p>{order.shipping_details.city}, {order.shipping_details.postalCode}</p>
              <p>{order.shipping_details.country}</p>
            </div>
          </div>
          
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="overflow-x-auto">
            <table className="w-full mb-6">
              <thead className="border-b">
                <tr>
                  <th className="px-4 py-2 text-left">Product</th>
                  <th className="px-4 py-2 text-center">Quantity</th>
                  <th className="px-4 py-2 text-right">Price</th>
                  <th className="px-4 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="px-4 py-4">{item.product_name}</td>
                    <td className="px-4 py-4 text-center">{item.quantity}</td>
                    <td className="px-4 py-4 text-right">${item.price.toFixed(2)}</td>
                    <td className="px-4 py-4 text-right">${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="px-4 py-2 text-right font-semibold">
                    Subtotal:
                  </td>
                  <td className="px-4 py-2 text-right">
                    ${(order.total - 10).toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} className="px-4 py-2 text-right font-semibold">
                    Shipping:
                  </td>
                  <td className="px-4 py-2 text-right">
                    $10.00
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} className="px-4 py-2 text-right font-semibold">
                    Total:
                  </td>
                  <td className="px-4 py-2 text-right font-bold">
                    ${order.total.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="text-center space-x-4">
          <Link href="/" className="btn btn-primary px-6 py-2">
            Continue Shopping
          </Link>
          <Link href="/account/orders" className="btn btn-secondary px-6 py-2">
            View All Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
