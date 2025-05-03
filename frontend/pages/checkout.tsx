import { useCart } from "../context/CartContext";
import { useState } from "react";

export default function Checkout() {
  const { cart } = useCart();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const order = {
      ...formData,
      items: cart,
    };

    const res = await fetch("http://localhost:8000/api/orders/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });

    if (res.ok) {
      alert("Order placed successfully!");
    } else {
      alert("Failed to place order.");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Place Order
        </button>
      </form>
    </div>
  );
}