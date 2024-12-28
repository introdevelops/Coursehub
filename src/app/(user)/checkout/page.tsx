
"use client";

import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { toast } from "react-toastify";


const CheckoutPage = () => {
  
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  
  const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

  const handlePayment = async () => {
    setLoading(true);

    const courseIds = cart.map((item) => item.id);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({courseIds}),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const data = await response.json();
      toast.success(data.message || "Payment successful!");
      

      clearCart();
      router.push("/my-courses");
      
    } catch (error) {
      if(error instanceof Error) {
      toast.error("Payment failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (<>
  <Navbar/>
    <div className="max-w-4xl mx-auto p-6 text-white mt-32">
      <h1 className="text-2xl font-bold mb-4">Order Summary</h1>

      {cart.length > 0 ? (
        <>
          <ul className="mb-4">
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between py-2 border-b">
                <span className="overflow-hidden whitespace-nowrap text-ellipsis">{item.title}</span>
                <span>₹{item.price}</span>
              </li>
            ))}
          </ul>

          <div className="flex justify-between items-center font-bold text-lg mb-6">
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </>
      ) : (
        <p className="text-gray-500">Your cart is empty.</p>
      )}
    </div>
    </>
  );
};

export default CheckoutPage;