import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import AccountLayout from '@/components/account/AccountLayout';

interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
  name: string;
}

interface Order {
  id: number;
  created_at: string;
  total_amount: number;
  status: string;
  items: OrderItem[];
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusTranslations = {
  pending: 'Oczekujące',
  processing: 'W realizacji',
  completed: 'Zrealizowane',
  cancelled: 'Anulowane',
};

export default function OrdersHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/orders/');
      setOrders(response.data);
    } catch (error) {
      setError('Nie udało się pobrać historii zamówień');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Ładowanie historii zamówień...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">Błąd</h2>
            <p className="mt-2 text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AccountLayout>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h1 className="text-lg leading-6 font-medium text-gray-900">
            Historia zamówień
          </h1>
        </div>
        
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Nie masz jeszcze żadnych zamówień</p>
            <Link 
              href="/"
              className="mt-4 inline-block px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Rozpocznij zakupy
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {orders.map((order) => (
              <div key={order.id} className="p-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-medium">Zamówienie #{order.id}</h2>
                    <p className="text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`px-4 py-2 rounded-full ${statusColors[order.status as keyof typeof statusColors]}`}>
                    {statusTranslations[order.status as keyof typeof statusTranslations]}
                  </div>
                </div>
                
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.name} x {item.quantity}</span>
                        <span>{(item.price * item.quantity).toFixed(2)} zł</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between font-medium mt-4 pt-4 border-t">
                    <span>Suma</span>
                    <span>{order.total_amount.toFixed(2)} zł</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Link
                    href={`/order-confirmation/${order.id}`}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    Zobacz szczegóły →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  );
} 