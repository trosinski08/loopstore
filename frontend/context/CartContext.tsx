// filepath: frontend/context/CartContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
}

interface CartItem extends Product {
  cartQuantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  updateQuantity: (id: number, quantity: number) => void;
  cartTotal: number;
  itemsCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [itemsCount, setItemsCount] = useState(0);

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
    // Calculate total
    const total = cart.reduce((sum, item) => sum + item.price * item.cartQuantity, 0);
    setCartTotal(total);
    // Calculate items count
    const count = cart.reduce((sum, item) => sum + item.cartQuantity, 0);
    setItemsCount(count);
  }, [cart]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      
      if (existingItem) {
        const newQuantity = existingItem.cartQuantity + quantity;
        if (newQuantity > product.stock) {
          alert("Not enough stock available");
          return prevCart;
        }
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, cartQuantity: newQuantity }
            : item
        );
      }

      if (quantity > product.stock) {
        alert("Not enough stock available");
        return prevCart;
      }

      return [...prevCart, { ...product, cartQuantity: quantity }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateQuantity = (id: number, quantity: number) => {
    setCart((prevCart) => {
      const item = prevCart.find((item) => item.id === id);
      if (!item) return prevCart;

      if (quantity > item.stock) {
        alert("Not enough stock available");
        return prevCart;
      }

      if (quantity < 1) {
        return prevCart.filter((item) => item.id !== id);
      }

      return prevCart.map((item) =>
        item.id === id ? { ...item, cartQuantity: quantity } : item
      );
    });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        cartTotal,
        itemsCount,
      }}
    >
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