"use client";

import React, { createContext, useContext, useEffect, useState } from "react";


interface CartItem {
  id: string;
  title: string;
  price: number;
}


interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
}


const CartContext = createContext<CartContextType | undefined>(undefined);


export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  
  useEffect(() => {
    const storedCart = localStorage.getItem("my-cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  
  useEffect(() => {
    localStorage.setItem("my-cart", JSON.stringify(cart));
  }, [cart]);

  
  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const exists = prevCart.some((cartItem) => cartItem.id === item.id);
      if (exists) {
        
        return prevCart;
      }
      return [...prevCart, item];
    });
  };

  
  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};


export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
