'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

interface AccountLayoutProps {
  children: ReactNode;
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Moje konto</h2>
            <nav className="space-y-2">
              <Link href="/account" className="block py-2 px-4 hover:bg-gray-100 rounded">
                Profil
              </Link>
              <Link href="/account/orders" className="block py-2 px-4 hover:bg-gray-100 rounded">
                Zamówienia
              </Link>
              <Link href="/account/addresses" className="block py-2 px-4 hover:bg-gray-100 rounded">
                Adresy
              </Link>
              <Link href="/account/settings" className="block py-2 px-4 hover:bg-gray-100 rounded">
                Ustawienia
              </Link>
              <button className="block w-full text-left py-2 px-4 hover:bg-gray-100 rounded text-red-600">
                Wyloguj się
              </button>
            </nav>
          </div>
        </div>
        
        <div className="md:col-span-3">
          <div className="bg-white shadow rounded-lg p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
