// filepath: frontend/context/CartContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  stock: number;
  description: string;
}

interface CartContextType {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  decreaseQuantity: (id: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([]);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((p) => p.id === product.id);
      if (existingProduct) {
        if (existingProduct.quantity + product.quantity > product.stock) {
		  alert("Not enough stock available");
		  return prevCart;
		}
		return prevCart.map((p) =>
          p.id === product.id
            ? { ...p, quantity: p.quantity + product.quantity }
            : p
        );
      }
      return [...prevCart, product];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((p) => p.id !== id));
	  }

  
  const decreaseQuantity = (id: number) => {
	setCart((prevCart) =>
	  prevCart.map((p) =>
		p.id === id && p.quantity > 1
		  ? { ...p, quantity: p.quantity - 1 }
		  : p
	  )
	);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, decreaseQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};