"use client";

/** FUNCTIONALITY */
import { useCart } from "@/hooks/cart";
/** COMPONENTS */
import Link from "next/link";
import { ButtonCheckout } from "./ButtonCheckout";
import { CartProduct } from "./CartProduct";
/** TYPES */
import type { ProductWithVariants } from "@/schemas";
import { HiShoppingCart, HiArrowRight, HiTag } from "react-icons/hi";

export const CartProducts = ({
  allProducts,
}: {
  allProducts: ProductWithVariants[];
}) => {
  const { items } = useCart();

  if (items && items.length > 0) {
    const cartProductsWithInfo = items
      .map((cartItem) => {
        // Find product by productId instead of variantId
        const product = allProducts.find((p) => p.id === cartItem.productId);
        if (!product) return null;

        // Use the first variant or create a default one
        const variant = product.variants?.[0] || {
          id: product.id,
          color: product.color || "Default",
          size: cartItem.size,
          sizes: [cartItem.size],
          images: product.images || [],
        };

        return {
          cartItem,
          product,
          variant,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    const subtotal = cartProductsWithInfo.reduce(
      (sum, { product, cartItem }) => sum + product.price * cartItem.quantity,
      0
    );

    const tax = subtotal * 0.18; // 18% GST
    const totalPrice = subtotal + tax;
    const savings = cartProductsWithInfo.reduce(
      (sum, { product, cartItem }) =>
        sum + ((product.cuttedPrice || product.price) - product.price) * cartItem.quantity,
      0
    );

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              Shopping Cart
            </h1>
            <p className="text-slate-600">
              {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartProductsWithInfo.map(({ product, cartItem, variant }) => (
                <CartProduct
                  key={cartItem.id}
                  product={product}
                  cartItemId={cartItem.id}
                  size={cartItem.size}
                  quantity={cartItem.quantity}
                  variant={variant}
                />
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sticky top-4">
                <h2 className="text-xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-200">
                  Order Summary
                </h2>

                {/* Price Breakdown */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal ({items.length} items)</span>
                    <span className="font-medium">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>

                  {savings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span className="flex items-center gap-1">
                        <HiTag className="w-4 h-4" />
                        Savings
                      </span>
                      <span className="font-medium">-₹{savings.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600">
                    <span>Tax (GST 18%)</span>
                    <span className="font-medium">₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <span className="font-medium text-green-600">FREE</span>
                  </div>
                </div>

                {/* Total */}
                <div className="pt-4 border-t border-slate-200 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-slate-900">Total</span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-600">
                        ₹{totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-xs text-slate-500">Incl. all taxes</div>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <ButtonCheckout cartItems={items} />

                {/* Continue Shopping */}
                <Link
                  href="/"
                  className="mt-4 w-full flex items-center justify-center gap-2 py-3 px-6 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-medium"
                >
                  Continue Shopping
                </Link>

                {/* Benefits */}
                <div className="mt-6 pt-6 border-t border-slate-200 space-y-3">
                  <div className="flex items-start gap-3 text-sm text-slate-600">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Free shipping on all orders</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-slate-600">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Secure payment processing</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-slate-600">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Easy returns within 30 days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[calc(100vh-200px)] gap-6 px-4 py-20">
      <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
        <HiShoppingCart className="w-12 h-12 text-slate-400" />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 text-center">
        Your Cart is Empty
      </h1>
      <p className="text-lg text-slate-600 text-center max-w-md">
        Looks like you haven't added any tiles to your cart yet. Start shopping to find the perfect tiles for your space!
      </p>
      <Link
        href="/"
        className="mt-4 flex items-center gap-2 px-8 py-4 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
      >
        <span>Start Shopping</span>
        <HiArrowRight className="w-5 h-5" />
      </Link>
    </div>
  );
};
