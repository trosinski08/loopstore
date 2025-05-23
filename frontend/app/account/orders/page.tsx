"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Order {
  id: number;
  order_number: string;
  created_at: string;
  status: string;
  payment_status: string;
  total_amount: number;
}

export default function OrdersPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) return;
      
      try {
        const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api';
        const res = await fetch(`${baseApiUrl}/orders/`, {
          credentials: 'include'
        });
        
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        } else {
          console.error("Failed to fetch orders:", res.status);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
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
          <h1 className="text-3xl font-bold mb-6">Order History</h1>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin inline-block rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <p className="text-gray-600">You haven't placed any orders yet.</p>
              <Link href="/shop" className="mt-4 inline-block btn btn-primary px-6 py-2">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.order_number || `#${order.id}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${
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
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
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
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${order.total_amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <Link 
                            href={`/account/orders/${order.id}`}
                            className="text-black underline font-medium hover:text-gray-700"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
