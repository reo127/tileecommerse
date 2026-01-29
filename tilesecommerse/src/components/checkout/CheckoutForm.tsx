"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart, useCartMutation } from "@/hooks/cart";
import { getAllProducts } from "@/app/actions";
import { toast } from "sonner";
import LoadingButton from "@/components/ui/loadingButton";
import { useValidateCoupon } from "@/hooks/coupon/mutations/useValidateCoupon";
import { HiLocationMarker, HiUser, HiPhone, HiMail, HiTag, HiX, HiCheckCircle, HiShieldCheck } from "react-icons/hi";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

export const CheckoutForm = () => {
  const router = useRouter();
  const { items } = useCart();
  const { clear: clearCart } = useCartMutation();
  const [isLoading, setIsLoading] = useState(false);
  const { validateAsync, isValidating } = useValidateCoupon();

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [upiId, setUpiId] = useState("");

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    finalAmount: number;
  } | null>(null);

  const [formData, setFormData] = useState({
    // Personal Info
    fullName: "",
    email: "",
    phoneNo: "",
    alternatePhone: "",

    // Shipping Address
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "",
    state: "",
    pinCode: "",

    // Additional Info
    addressType: "home",
    deliveryInstructions: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    try {
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
      const taxPrice = totalPrice * 0.18;
      const shippingPrice = totalPrice > 5000 ? 0 : 200;
      const totalAmount = totalPrice + taxPrice + shippingPrice;

      const result = await validateAsync({
        code: couponCode,
        orderAmount: totalAmount,
      });

      if (result.success && result.valid) {
        setAppliedCoupon({
          code: result.coupon.code,
          discount: result.coupon.discount,
          finalAmount: result.coupon.finalAmount,
        });
        toast.success(`Coupon applied! You saved ₹${result.coupon.discount}`);
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast.info("Coupon removed");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === 'upi' && !upiId.trim()) {
      toast.error("Please enter your UPI ID");
      return;
    }

    setIsLoading(true);

    try {
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
      const taxPrice = totalPrice * 0.18;
      const shippingPrice = totalPrice > 5000 ? 0 : 200;
      const totalAmount = totalPrice + taxPrice + shippingPrice;
      const finalAmount = appliedCoupon ? appliedCoupon.finalAmount : totalAmount;

      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1'}/order/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          shippingInfo: {
            address: `${formData.addressLine1}, ${formData.addressLine2 ? formData.addressLine2 + ', ' : ''}${formData.landmark ? 'Near ' + formData.landmark : ''}`.trim(),
            city: formData.city,
            state: formData.state,
            country: "India",
            pincode: parseInt(formData.pinCode),
            phoneNo: parseInt(formData.phoneNo),
          },
          orderItems,
          paymentInfo: {
            id: paymentMethod === 'upi' ? `upi_${Date.now()}` : `cash_${Date.now()}`,
            status: paymentMethod === 'upi' ? `UPI Payment (${upiId})` : "Cash on Delivery",
          },
          itemsPrice: totalPrice,
          taxPrice,
          shippingPrice,
          totalPrice: finalAmount,
          couponCode: appliedCoupon?.code || null,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to place order');
      }

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
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <HiLocationMarker className="w-12 h-12 text-orange-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Your cart is empty</h2>
          <p className="text-slate-600 mb-8">Add some products to your cart before checking out</p>
          <a
            href="/search"
            className="inline-flex items-center gap-2 bg-orange-500 text-white px-8 py-3 rounded-xl hover:bg-orange-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
          >
            Browse Products
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Checkout</h1>
          <p className="text-slate-600">Complete your order in just a few steps</p>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <HiUser className="w-5 h-5 text-orange-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNo"
                    required
                    value={formData.phoneNo}
                    onChange={handleChange}
                    maxLength={10}
                    pattern="[0-9]{10}"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="10-digit mobile number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Alternate Number (Optional)
                  </label>
                  <input
                    type="tel"
                    name="alternatePhone"
                    value={formData.alternatePhone}
                    onChange={handleChange}
                    maxLength={10}
                    pattern="[0-9]{10}"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="Alternate contact"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <HiLocationMarker className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Delivery Address</h2>
              </div>

              <div className="space-y-4">
                {/* Address Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Address Type <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-3">
                    {['home', 'office', 'other'].map((type) => (
                      <label
                        key={type}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-xl cursor-pointer transition-all ${formData.addressType === type
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-slate-200 hover:border-slate-300'
                          }`}
                      >
                        <input
                          type="radio"
                          name="addressType"
                          value={type}
                          checked={formData.addressType === type}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <span className="font-medium capitalize">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Address Line 1 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="addressLine1"
                    required
                    value={formData.addressLine1}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="House No., Building Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Address Line 2 (Optional)
                  </label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="Road Name, Area, Colony"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="E.g., Near Metro Station, Opposite Mall"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="City"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      State <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select State</option>
                      {INDIAN_STATES.map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      PIN Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pinCode"
                      required
                      value={formData.pinCode}
                      onChange={handleChange}
                      maxLength={6}
                      pattern="[0-9]{6}"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="6-digit PIN code"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Delivery Instructions (Optional)
                  </label>
                  <textarea
                    name="deliveryInstructions"
                    value={formData.deliveryInstructions}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                    placeholder="Any specific instructions for delivery..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Coupon Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <HiTag className="w-5 h-5 text-green-600" />
                  <h3 className="font-bold text-slate-900">Apply Coupon</h3>
                </div>

                {!appliedCoupon ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent uppercase"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={isValidating || !couponCode.trim()}
                      className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all shadow-lg hover:shadow-xl"
                    >
                      {isValidating ? "Validating..." : "Apply Coupon"}
                    </button>
                  </div>
                ) : (
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <HiCheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-green-900">{appliedCoupon.code}</p>
                          <p className="text-sm text-green-700 mt-1">
                            You saved ₹{appliedCoupon.discount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <HiX className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <HiShieldCheck className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-slate-900">Payment Method</h3>
                </div>

                <div className="space-y-3">
                  {/* UPI Option */}
                  <label className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'upi'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-slate-200 hover:border-slate-300'
                    }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="upi"
                        checked={paymentMethod === 'upi'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-orange-500"
                      />
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">📱</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">UPI Payment</p>
                        <p className="text-xs text-slate-600">GPay, PhonePe, Paytm</p>
                      </div>
                    </div>

                    {paymentMethod === 'upi' && (
                      <div className="mt-3 pl-14">
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="yourname@paytm"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                          required={paymentMethod === 'upi'}
                        />
                        <p className="text-xs text-slate-500 mt-2">
                          Payment request will be sent to your UPI app
                        </p>
                      </div>
                    )}
                  </label>

                  {/* COD Option */}
                  <label className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'cod'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-slate-200 hover:border-slate-300'
                    }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-orange-500"
                      />
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">💵</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">Cash on Delivery</p>
                        <p className="text-xs text-slate-600">Pay when you receive</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <LoadingButton
                  type="submit"
                  loading={isLoading}
                  className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all font-bold text-lg shadow-lg hover:shadow-xl"
                >
                  Place Order
                </LoadingButton>

                <button
                  type="button"
                  onClick={() => router.push('/cart')}
                  className="w-full px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-medium"
                >
                  Back to Cart
                </button>
              </div>

              {/* Trust Badges */}
              <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <HiCheckCircle className="w-4 h-4 text-green-600" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <HiCheckCircle className="w-4 h-4 text-green-600" />
                  <span>Free delivery on orders above ₹5000</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <HiCheckCircle className="w-4 h-4 text-green-600" />
                  <span>Easy returns & exchanges</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
