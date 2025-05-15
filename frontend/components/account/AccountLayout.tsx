import Link from 'next/link';
import { useRouter } from 'next/router';

interface AccountLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Historia zamówień', href: '/account/orders' },
  { name: 'Dane dostawy', href: '/account/delivery-details' },
];

export default function AccountLayout({ children }: AccountLayoutProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
          <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
            <nav className="space-y-1">
              {navigation.map((item) => {
                const isActive = router.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group rounded-md px-3 py-2 flex items-center text-sm font-medium ${
                      isActive
                        ? 'bg-gray-50 text-indigo-600 hover:bg-white'
                        : 'text-gray-900 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          <main className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
} 