"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface OrderItem {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface OrderStatus {
  status: string;
  notes: string;
  created_at: string;
}

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  address: string;
  items: OrderItem[];
  status: string;
  payment_status: string;
  payment_method: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
  status_history: OrderStatus[];
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { isLoading, isAuthenticated } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!isAuthenticated) return;
      
      try {
        const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api';
        const res = await fetch(`${baseApiUrl}/orders/${params.id}/`, {
          credentials: 'include'
        });
        
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        } else if (res.status === 404) {
          router.push('/account/orders');
        } else {
          console.error("Failed to fetch order details:", res.status);
        }
      } catch (err) {
        console.error("Error fetching order details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchOrderDetails();
    }
  }, [isAuthenticated, params.id, router]);

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!isAuthenticated || !order) {
    return null; // Will redirect to login or orders page
  }

  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}        <div className="w-full md:w-64 space-y-4">
          <h2 className="text-xl font-bold mb-4">My Account</h2>
          <nav className="space-y-2">
            <Link href="/account" className="block py-2 border-b border-gray-200">
              Dashboard
            </Link>
            <Link href="/account/orders" className="block py-2 border-b border-gray-200 font-medium">
              Order History
            </Link>
            <Link href="/account/favorites" className="block py-2 border-b border-gray-200">
              My Favorites
            </Link>
            <Link href="/account/addresses" className="block py-2 border-b border-gray-200">
              Addresses
            </Link>
            <Link href="/account/settings" className="block py-2 border-b border-gray-200">
              Account Settings
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Order Details</h1>
            <Link href="/account/orders" className="text-black underline">
              Back to Orders
            </Link>
          </div>
          
          <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
            <div className="border-b border-gray-200 p-6">
              <div className="flex flex-col md:flex-row justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">
                    {order.order_number || `Order #${order.id}`}
                  </h2>
                  <p className="text-gray-500">
                    Placed on {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
                  </p>
                </div>
                <div className="mt-2 md:mt-0">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'delivered' 
                      ? 'bg-green-100 text-green-800' 
                      : order.status === 'shipped'
                      ? 'bg-blue-100 text-blue-800'
                      : order.status === 'processing'
                      ? 'bg-yellow-100 text-yellow-800'
                      : order.status === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    Status: {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Order Items</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {order.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            {item.image && (
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="h-16 w-16 object-cover mr-4 rounded"
                              />
                            )}
                            <div>
                              <Link 
                                href={`/product/${item.product_id}`} 
                                className="text-black hover:underline"
                              >
                                {item.name}
                              </Link>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-4 text-right text-sm font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={3} className="px-4 py-3 text-right font-medium">Subtotal</td>
                      <td className="px-4 py-3 text-right font-medium">
                        ${order.total_amount.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="px-4 py-3 text-right font-semibold">Total</td>
                      <td className="px-4 py-3 text-right font-semibold">
                        ${order.total_amount.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Customer Information */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Contact Information</h4>
                  <p>{order.customer_name}</p>
                  <p>{order.customer_email}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Shipping Address</h4>
                  <p>{order.address}</p>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Payment Method</h4>
                  <p>{order.payment_method.charAt(0).toUpperCase() + order.payment_method.slice(1)}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Payment Status</h4>
                  <p>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.payment_status === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : order.payment_status === 'refunded'
                        ? 'bg-purple-100 text-purple-800'
                        : order.payment_status === 'failed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Order Status History */}
            {order.status_history && order.status_history.length > 0 && (
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Order History</h3>
                <ol className="relative border-l border-gray-200">
                  {order.status_history.map((status, index) => (
                    <li key={index} className="mb-6 ml-6">
                      <span className="absolute flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full -left-3 ring-8 ring-white">
                        <svg className="w-2.5 h-2.5 text-blue-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
                        </svg>
                      </span>
                      <h3 className="flex items-center mb-1 text-md font-semibold text-gray-900">
                        {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
                      </h3>
                      <time className="block mb-2 text-xs font-normal leading-none text-gray-400">
                        {new Date(status.created_at).toLocaleDateString()} at {new Date(status.created_at).toLocaleTimeString()}
                      </time>
                      {status.notes && (
                        <p className="mb-4 text-sm font-normal text-gray-500">
                          {status.notes}
                        </p>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
