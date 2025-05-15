import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">About Us</h3>
            <p className="text-gray-300">
              Sustainable fashion through upcycling. Join us in making fashion more environmentally friendly.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-300 hover:text-white">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/categories/tops" className="text-gray-300 hover:text-white">
                  Tops
                </Link>
              </li>
              <li>
                <Link href="/categories/bottoms" className="text-gray-300 hover:text-white">
                  Bottoms
                </Link>
              </li>
              <li>
                <Link href="/categories/dresses" className="text-gray-300 hover:text-white">
                  Dresses
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Email: contact@upcycledfashion.com</li>
              <li>Phone: (123) 456-7890</li>
              <li>Address: 123 Fashion St, City</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} Upcycled Fashion. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 