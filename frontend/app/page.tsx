"use client";

import { useEffect, useState } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ArrowRight } from 'lucide-react';
import { getMediaUrl } from "@/lib/utils";
import Newsletter from "@/components/Newsletter";

interface Product {
	id: number;
	name: string;
	description: string;
	price: number;
	image: string;
	stock: number;
	quantity: number;
}

export default function Home() {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { addToCart } = useCart();

	useEffect(() => {
		const fetchProducts = async () => {
			try {
        const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api';
				const res = await fetch(`${baseApiUrl}/products/`);
				if (!res.ok) {
					throw new Error("Failed to fetch products");
				}
				const data = await res.json();
				setProducts(data);
			} catch (err) {
				setError(err instanceof Error ? err.message : "An error occurred");
				console.error("Error fetching products:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchProducts();
	}, []);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-red-500">{error}</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col min-h-screen">
			{/* Hero Section */}
			<section className="relative h-[80vh] bg-gray-100">
				<div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
					<div className="text-gray-500 text-lg">Hero Image Placeholder</div>
				</div>
				<div className="relative container mx-auto h-full flex items-center">
					<div className="text-black max-w-2xl">
						<h1 className="text-5xl font-bold mb-4">Discover Upcycled Fashion</h1>
						<p className="text-xl mb-8">
							Sustainable, unique pieces that make a statement while making a difference.
						</p>
						<Link
							href="/shop"
							className="btn btn-primary px-8 py-3 text-lg"
						>
							Shop Now
						</Link>
					</div>
				</div>
			</section>

			{/* Featured Categories */}
			<section className="py-16">
				<div className="container">
					<h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{['Tops', 'Bottoms', 'Accessories'].map((category) => (
							<Link
								key={category}
								href={`/shop?category=${category.toLowerCase()}`}
								className="group relative h-64 overflow-hidden bg-gray-100"
							>
								<div className="absolute inset-0 flex items-center justify-center text-gray-500">
									{category} Image Placeholder
								</div>
								<div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
								<div className="absolute inset-0 flex items-center justify-center">
									<span className="text-white text-2xl font-bold">{category}</span>
								</div>
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* Featured Products */}
			<section className="py-16 bg-gray-50">
				<div className="container">
					<h2 className="text-3xl font-bold mb-8">Featured Products</h2>
					
					{products.length === 0 ? (
						<div className="text-center py-8">
							<p className="text-gray-600">No products found</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
							{products.slice(0, 4).map((product) => (
								<div key={product.id} className="group">
									<Link href={`/product/${product.id}`} className="block">
										<div className="relative aspect-square overflow-hidden bg-gray-100 mb-4">
											<Image
												src={getMediaUrl(product.image)}
												alt={product.name}
												fill
												className="object-cover transition-transform group-hover:scale-105"
												sizes="(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 25vw"
											/>
										</div>
										<h3 className="font-semibold mb-2">{product.name}</h3>
										<p className="text-gray-600 mb-2">${product.price}</p>
									</Link>
									<button
										onClick={() => addToCart(product)}
										className="w-full btn btn-primary py-2"
										disabled={product.stock === 0}
									>
										{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
									</button>
								</div>
							))}
						</div>
					)}
					
					<div className="text-center mt-12">
						<Link href="/shop" className="btn btn-secondary px-8 py-3">
							View All Products
						</Link>
					</div>
				</div>
			</section>			{/* Newsletter Section */}
			<Newsletter />
		</div>
	);
}