// This file is a Next.js page that displays product details.
import { GetServerSideProps } from "next";
import { useCart } from "../../context/CartContext";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
}

// Removed duplicate ProductDetails function to avoid redeclaration error.

export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log("Context params:", context.params);

  const { id } = context.params!;
  const res = await fetch(`http://127.0.0.1:8000/api/products/${id}/`);

  if (!res.ok) {
    return {
      notFound: true,
    };
  }

  const product = await res.json();
  product.price = parseFloat(product.price); // Ensure price is a number

  return {
    props: {
      product,
    },
  };
};


export default function ProductDetails({ product }: { product: Product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (product.stock > 0) {
		addToCart({ ...product, quantity: 1 });
		alert("Product added to cart successfully!");
	}
	else {
		alert("Product is out of stock");
	}
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-auto mb-4"
      />
      <p className="text-gray-600">{product.description}</p>
      <p className="text-green-500 font-bold">${product.price}</p>
      <p className="text-gray-500">Stock: {product.stock}</p>
      <button
        onClick={handleAddToCart}
        className="bg-blue-500 text-white px-4 py-2 mt-4"
      >
        Add to Cart
      </button>
    </div>
  );
}