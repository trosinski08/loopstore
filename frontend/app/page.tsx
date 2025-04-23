"use client";

import { useEffect, useState } from "react";

export default async function Home() {
	const res = await fetch("http://127.0.0.1:8000/api/products/", { cache: "no-store" });
	if (!res.ok) {
		throw new Error("Failed to fetch data");
	}
	const products = await res.json();
  
	return (
	  <div className="p-8">
		<h1 className="text-2xl font-bold mb-4">Let's stay in LOOP's</h1>
		<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
		  {products.map((product: { id: number; name: string; description: string; price: number }) => (
			<li key={product.id} className="border p-4 rounded shadow">
			  <h2 className="text-xl font-semibold">{product.name}</h2>
			  <p className="text-gray-600">{product.description}</p>
			  <p className="text-green-500 font-bold">${product.price}</p>
			</li>
		  ))}
		</ul>
	  </div>
	);
  }