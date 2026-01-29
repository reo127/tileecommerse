"use client";

import { useState } from "react";
import { useCartMutation } from "@/hooks/cart";
// import { useWishlistMutation } from "@/hooks/wishlist";
import { toast } from "sonner";
import type { ProductWithVariants } from "@/schemas";

interface ProductInfoProps {
  product: ProductWithVariants;
}

export const ProductInfo = ({ product }: ProductInfoProps) => {
  const [selectedColor, setSelectedColor] = useState(product.variants[0]?.color || "");
  const [selectedSize, setSelectedSize] = useState(
    // @ts-ignore - dummy data uses 'size', real schema uses 'sizes'
    (product.variants[0]?.sizes?.[0] || product.variants[0]?.size) as string || ""
  );
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");

  const { add: addToCart, isAdding } = useCartMutation();
  // const { add: addToWishlist, isAddingToWishlist } = useWishlistMutation();

  const handleAddToCart = () => {
    const selectedVariant = product.variants.find((v: any) => v.color === selectedColor);

    addToCart({
      size: selectedSize || "default",
      variantId: selectedVariant?.id || product.id,
      stripeId: selectedVariant?.stripeId || `product_${product.id}`,
      productId: product.id,
      quantity: quantity,
    });

    toast.success("Added to cart!");
  };

  const handleAddToWishlist = () => {
    // addToWishlist(product.id);
    toast.info("Wishlist feature coming soon!");
  };

  const uniqueColors = Array.from(new Set(product.variants.map((v: any) => v.color)));
  // Handle both 'sizes' array and 'size' string from dummy data
  const uniqueSizes = Array.from(new Set(
    product.variants.flatMap((v: any) =>
      // @ts-ignore - dummy data uses 'size', real schema uses 'sizes'
      (v.sizes && v.sizes.length > 0) ? v.sizes : [v.size]
    ).filter(Boolean)
  ));

  return (
    <div className="space-y-6">
      {/* Product Title */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-2">
          {product.name}
        </h1>
        <p className="text-slate-600">{product.description}</p>
      </div>

      {/* Price */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-baseline gap-2">
          <span className="text-sm text-slate-600">Price:</span>
          <span className="text-3xl font-bold text-orange-500">₹{product.price.toFixed(0)}</span>
          <span className="text-sm text-slate-600">/ sq.ft</span>
        </div>
      </div>

      {/* Available Colors */}
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-3">Available Colors</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {uniqueColors.map((color: any) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`relative aspect-square rounded-lg border-2 transition-all overflow-hidden ${
                selectedColor === color
                  ? "border-orange-500 ring-2 ring-orange-200"
                  : "border-gray-300 hover:border-orange-300"
              }`}
            >
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-400 flex items-center justify-center">
                <span className="text-xs text-center px-1 font-medium text-slate-700">
                  {color}
                </span>
              </div>
              {selectedColor === color && (
                <div className="absolute inset-0 flex items-center justify-center bg-orange-500/20">
                  <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Available Sizes */}
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-3">Available Sizes</h3>
        <div className="flex flex-wrap gap-2">
          {uniqueSizes.map((size: any) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-6 py-3 rounded-lg border-2 font-medium transition-all ${
                selectedSize === size
                  ? "border-orange-500 bg-orange-50 text-orange-600"
                  : "border-gray-300 text-slate-700 hover:border-orange-300"
              }`}
            >
              {size}"
            </button>
          ))}
        </div>
      </div>

      {/* Check Deliverability */}
      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-800 mb-3">Check Deliverability</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            maxLength={6}
          />
          <button className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium">
            Check
          </button>
        </div>
      </div>

      {/* Select Quantity */}
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-3">Select Quantity</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center border-2 border-gray-300 rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 py-2 text-xl font-semibold text-slate-700 hover:bg-gray-100 transition-colors"
            >
              −
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 text-center py-2 font-semibold text-slate-800 focus:outline-none"
              min="1"
            />
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-4 py-2 text-xl font-semibold text-slate-700 hover:bg-gray-100 transition-colors"
            >
              +
            </button>
          </div>
          <span className="text-sm text-slate-600">Box (12 sq.ft)</span>
        </div>
      </div>

      {/* Total Price */}
      <div className="bg-slate-900 text-white rounded-lg p-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm">Total Price:</span>
          <span className="text-2xl font-bold">₹{(product.price * quantity * 12).toFixed(0)}</span>
        </div>
        <p className="text-xs text-gray-400">For {quantity} box(es) - {quantity * 12} sq.ft</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleAddToWishlist}
          className="flex-1 bg-slate-900 text-white py-4 rounded-lg hover:bg-slate-800 transition-colors font-semibold text-lg"
        >
          Add to Wishlist
        </button>
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="flex-1 bg-orange-500 text-white py-4 rounded-lg hover:bg-orange-600 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAdding ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};
