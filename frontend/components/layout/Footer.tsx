'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  const footerLinks = {
    'Quick Links': [
      { name: 'Home', href: '/' },
      { name: 'Shop', href: '/shop' },
      { name: 'About', href: '/about' },
      { name: 'Contact', href: '/contact' },
    ],
    'Customer Service': [
      { name: 'Shipping Policy', href: '/shipping' },
      { name: 'Returns & Exchanges', href: '/returns' },
      { name: 'FAQs', href: '/faqs' },
      { name: 'Size Guide', href: '/size-guide' },
    ],
    'About Us': [
      { name: 'Our Story', href: '/our-story' },
      { name: 'Blog', href: '/blog' },
      { name: 'Sustainability', href: '/sustainability' },
      { name: 'Careers', href: '/careers' },
    ],
  };

  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Subscribe to our newsletter</h3>
            <p className="text-gray-600">
              Be the first to know about new collections and exclusive offers.
            </p>
            <form onSubmit={handleSubmit} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-4">
              <h3 className="text-lg font-semibold">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-black transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Footer */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-600">
              © {new Date().getFullYear()} LOOPS. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-black">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-black">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-black">
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 