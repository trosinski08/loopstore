import { GetServerSideProps } from "next";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  image: string;
}

export default function ProductDetails({ product }: { product: Product }) {
  if (!product) return <p>Product not found</p>;

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
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  const res = await fetch(`http://127.0.0.1:8000/api/products/${id}/`);

  if (!res.ok) {
    return {
      notFound: true,
    };
  }

  const product = await res.json();

  return {
    props: {
      product,
    },
  };
};