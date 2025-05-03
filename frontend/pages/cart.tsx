// filepath: frontend/pages/cart.tsx
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, removeFromCart } = useCart();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cart.map((item) => (
            <li key={item.id} className="mb-4">
              <h2>{item.name}</h2>
              <p>Price: ${item.price}</p>
              <p>Quantity: {item.quantity}</p>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}