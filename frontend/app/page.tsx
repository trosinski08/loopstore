"use client";

import { useEffect, useState } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ArrowRight } from 'lucide-react';

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
				const res = await fetch("http://127.0.0.1:8000/api/products/");
				if (!res.ok) {
					throw new Error("Failed to fetch products");
				}
				const data = await res.json();
				setProducts(data);
			} catch (err) {
				setError(err instanceof Error ? err.message : "An error occurred");
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
				<div className="absolute inset-0">
					<Image
						src="/images/hero-image.jpg"
						alt="Hero"
						fill
						className="object-cover"
						priority
					/>
					<div className="absolute inset-0 bg-black/40" />
				</div>
				<div className="relative container mx-auto h-full flex items-center">
					<div className="text-white max-w-2xl">
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
								className="group relative h-64 overflow-hidden"
							>
								<Image
									src={`/images/category-${category.toLowerCase()}.jpg`}
									alt={category}
									fill
									className="object-cover transition-transform group-hover:scale-105"
								/>
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
					<div className="flex justify-between items-center mb-8">
						<h2 className="text-3xl font-bold">Featured Products</h2>
						<Link
							href="/shop"
							className="flex items-center text-gray-600 hover:text-black"
						>
							View All <ArrowRight className="ml-2" size={20} />
						</Link>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{products.slice(0, 4).map((product) => (
							<div key={product.id} className="group">
								<div className="relative aspect-square overflow-hidden bg-gray-100 mb-4">
									<Image
										src={product.image || '/images/placeholder.jpg'}
										alt={product.name}
										fill
										className="object-cover transition-transform group-hover:scale-105"
									/>
								</div>
								<h3 className="font-semibold mb-2">{product.name}</h3>
								<p className="text-gray-600 mb-2">${product.price}</p>
								<button
									onClick={() => addToCart(product)}
									className="w-full btn btn-primary py-2"
								>
									Add to Cart
								</button>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Newsletter Section */}
			<section className="py-16">
				<div className="container">
					<div className="max-w-2xl mx-auto text-center">
						<h2 className="text-3xl font-bold mb-4">Stay in the Loop</h2>
						<p className="text-gray-600 mb-8">
							Subscribe to our newsletter for exclusive offers and updates on new arrivals.
						</p>
						<form className="flex gap-4">
							<input
								type="email"
								placeholder="Enter your email"
								className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
								required
							/>
							<button type="submit" className="btn btn-primary px-8">
								Subscribe
							</button>
						</form>
					</div>
				</div>
			</section>
		</div>
	);
}