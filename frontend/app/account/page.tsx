"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Order {
  id: number;
  created_at: string;
  total: number;
  status: string;
}

export default function AccountPage() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Fetch order history
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
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

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
            <Link href="/account" className="block py-2 border-b border-gray-200 font-medium">
              Dashboard
            </Link>
            <Link href="/account/orders" className="block py-2 border-b border-gray-200">
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
            <button 
              onClick={handleLogout}
              className="block w-full text-left py-2 text-red-600 hover:text-red-800"
            >
              Logout
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-6">Account Dashboard</h1>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-bold mb-4">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-600">Contact Information</h3>
                <p className="mt-2">{user?.firstName} {user?.lastName}</p>
                <p>{user?.email}</p>
              </div>
              <div className="text-right">
                <Link href="/account/settings" className="text-black underline">
                  Edit
                </Link>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Recent Orders</h2>
              <Link href="/account/orders" className="text-black underline">
                View All
              </Link>
            </div>
            
            {ordersLoading ? (
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
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="px-4 py-2 text-left">Order #</th>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-left">Total</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="border-b">
                        <td className="px-4 py-4">{order.id}</td>
                        <td className="px-4 py-4">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4">${order.total.toFixed(2)}</td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            order.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : order.status === 'processing'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Link href={`/account/orders/${order.id}`} className="text-black underline">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}