"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart, useCartMutation } from "@/hooks/cart";
import { getAllProducts } from "@/app/actions";
import { toast } from "sonner";
import LoadingButton from "@/components/ui/loadingButton";

export const CheckoutForm = () => {
  const router = useRouter();
  const { items } = useCart();
  const { clear: clearCart } = useCartMutation();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Shipping Info
    shippingAddress: "",
    shippingCity: "",
    shippingState: "",
    shippingCountry: "India",
    shippingPinCode: "",
    shippingPhoneNo: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get all products to calculate total
      const allProducts = await getAllProducts();

      const orderItems = items.map(item => {
        const product = allProducts.find((p: any) => p.id === item.productId);
        return {
          product: item.productId,
          name: product?.name || "Unknown Product",
          price: product?.price || 0,
          quantity: item.quantity,
          image: product?.img || "",
        };
      });

      const totalPrice = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const taxPrice = totalPrice * 0.18; // 18% GST
      const shippingPrice = totalPrice > 5000 ? 0 : 200; // Free shipping above ₹5000
      const totalAmount = totalPrice + taxPrice + shippingPrice;

      const orderData = {
        shippingInfo: {
          address: formData.shippingAddress,
          city: formData.shippingCity,
          state: formData.shippingState,
          country: formData.shippingCountry,
          pincode: parseInt(formData.shippingPinCode), // lowercase 'c' and convert to number
          phoneNo: parseInt(formData.shippingPhoneNo), // convert to number
        },
        orderItems,
        paymentInfo: {
          id: `cash_${Date.now()}`,
          status: "Cash on Delivery",
        },
        totalPrice: totalAmount,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1'}/order/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: 'include',
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to place order');
      }

      const data = await response.json();

      // Clear cart
      clearCart();

      toast.success('Order placed successfully!');
      router.push(`/orders?success=true`);
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to place order');
    } finally {
      setIsLoading(false);
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Your cart is empty</h2>
        <p className="text-slate-600 mb-6">Add some products to your cart before checking out</p>
        <a href="/search" className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600">
          Browse Products
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6">Shipping Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Street Address *
          </label>
          <textarea
            name="shippingAddress"
            required
            value={formData.shippingAddress}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Enter your full address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City *
          </label>
          <input
            type="text"
            name="shippingCity"
            required
            value={formData.shippingCity}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="City"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State *
          </label>
          <input
            type="text"
            name="shippingState"
            required
            value={formData.shippingState}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="State"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PIN Code *
          </label>
          <input
            type="text"
            name="shippingPinCode"
            required
            value={formData.shippingPinCode}
            onChange={handleChange}
            maxLength={6}
            pattern="[0-9]{6}"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="6-digit PIN code"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            name="shippingPhoneNo"
            required
            value={formData.shippingPhoneNo}
            onChange={handleChange}
            maxLength={10}
            pattern="[0-9]{10}"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="10-digit mobile number"
          />
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
        <div className="flex items-center">
          <input
            type="radio"
            id="cod"
            name="paymentMethod"
            checked
            readOnly
            className="w-4 h-4 text-orange-500"
          />
          <label htmlFor="cod" className="ml-2 text-gray-700">
            Cash on Delivery (COD)
          </label>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Pay with cash when your order is delivered
        </p>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <button
          type="button"
          onClick={() => router.push('/cart')}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Back to Cart
        </button>

        <LoadingButton
          type="submit"
          loading={isLoading}
          className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Place Order
        </LoadingButton>
      </div>
    </form>
  );
};
