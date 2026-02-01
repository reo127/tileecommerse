"use client";

import { useState } from "react";
import { useCartMutation } from "@/hooks/cart";
import { useWishlistMutation } from "@/hooks/wishlist";
import { useSession } from "@/lib/auth/client";
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
  const [selectedFinish, setSelectedFinish] = useState(product.variants[0]?.finish || "");
  const [quantity, setQuantity] = useState(1);

  const { data: session } = useSession();
  const { add: addToCart, isAdding } = useCartMutation();
  const { add: addToWishlist, isAddingToWishlist } = useWishlistMutation();

  // Get current selected variant based on color, size, and finish
  const selectedVariant = product.variants.find((v: any) =>
    v.color === selectedColor &&
    (v.size === selectedSize || v.sizes?.includes(selectedSize)) &&
    (!selectedFinish || v.finish === selectedFinish)
  ) || product.variants[0];

  // Get variant-specific price and stock
  const currentPrice = selectedVariant?.price || product.price;
  const currentStock = selectedVariant?.stock || product.stock;
  const currentMRP = product.cuttedPrice;

  const handleAddToCart = () => {
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
    if (!session?.user) {
      toast.info("Login first to add to wishlist");
      return;
    }
    addToWishlist(product.id);
    toast.success("Added to wishlist!");
  };

  const uniqueColors = Array.from(new Set(product.variants.map((v: any) => v.color))).filter(Boolean);
  // Handle both 'sizes' array and 'size' string from dummy data
  const uniqueSizes = Array.from(new Set(
    product.variants.flatMap((v: any) =>
      // @ts-ignore - dummy data uses 'size', real schema uses 'sizes'
      (v.sizes && v.sizes.length > 0) ? v.sizes : [v.size]
    ).filter(Boolean)
  ));
  const uniqueFinishes = Array.from(new Set(product.variants.map((v: any) => v.finish))).filter(Boolean);


  return (
    <div className="space-y-6">
      {/* Product Tags - Colorful Badges */}
      {product.tags && product.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {product.tags.map((tag: string) => {
            const tagStyles: Record<string, string> = {
              popular: 'bg-blue-100 text-blue-700 border-blue-300',
              trending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
              new: 'bg-green-100 text-green-700 border-green-300',
              premium: 'bg-purple-100 text-purple-700 border-purple-300',
              exclusive: 'bg-pink-100 text-pink-700 border-pink-300',
              classic: 'bg-slate-100 text-slate-700 border-slate-300',
              bestseller: 'bg-orange-100 text-orange-700 border-orange-300',
              limited: 'bg-red-100 text-red-700 border-red-300',
            };

            const tagIcons: Record<string, string> = {
              popular: '⭐',
              trending: '🔥',
              new: '✨',
              premium: '💎',
              exclusive: '👑',
              classic: '🏛️',
              bestseller: '🏆',
              limited: '⏰',
            };

            return (
              <span
                key={tag}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${tagStyles[tag] || 'bg-gray-100 text-gray-700 border-gray-300'
                  }`}
              >
                {tagIcons[tag]} {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </span>
            );
          })}
        </div>
      )}

      {/* Product Title */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-2">
          {product.name}
        </h1>
        <p className="text-slate-600">{product.shortDescription || product.description}</p>
      </div>

      {/* Price with MRP and Discount */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-baseline gap-3 mb-1">
          <span className="text-sm text-slate-600">Price:</span>
          <span className="text-3xl font-bold text-orange-500">₹{currentPrice.toFixed(0)}</span>
          {currentMRP && currentMRP > currentPrice && (
            <>
              <span className="text-lg text-slate-400 line-through">₹{currentMRP.toFixed(0)}</span>
              <span className="text-sm font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
                {Math.round(((currentMRP - currentPrice) / currentMRP) * 100)}% OFF
              </span>
            </>
          )}
          <span className="text-sm text-slate-600">/ sq.ft</span>
        </div>
        {/* Stock Count */}
        {currentStock !== undefined && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-slate-600">Stock:</span>
            <span className={`text-xs font-semibold ${currentStock > 50 ? 'text-green-600' :
              currentStock > 10 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
              {currentStock} units available
            </span>
          </div>
        )}
      </div>


      {/* Available Colors - Smaller boxes with bigger text */}
      {uniqueColors.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-800 mb-3">Available Colors</h3>
          <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
            {uniqueColors.map((color: any) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`relative aspect-square rounded-lg border-2 transition-all overflow-hidden ${selectedColor === color
                  ? "border-orange-500 ring-2 ring-orange-200"
                  : "border-gray-300 hover:border-orange-300"
                  }`}
              >
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-400 flex items-center justify-center">
                  <span className="text-xs text-center px-1 font-semibold text-slate-700">
                    {color}
                  </span>
                </div>
                {selectedColor === color && (
                  <div className="absolute inset-0 flex items-center justify-center bg-orange-500/20">
                    <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Available Sizes */}
      {uniqueSizes.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-800 mb-3">Available Sizes</h3>
          <div className="flex flex-wrap gap-2">
            {uniqueSizes.map((size: any) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-6 py-3 rounded-lg border-2 font-medium transition-all ${selectedSize === size
                  ? "border-orange-500 bg-orange-50 text-orange-600"
                  : "border-gray-300 text-slate-700 hover:border-orange-300"
                  }`}
              >
                {size}&quot;
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Finish and Quantity - Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Available Finishes */}
        {uniqueFinishes.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Select Finish</h3>
            <select
              value={selectedFinish}
              onChange={(e) => setSelectedFinish(e.target.value)}
              className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium text-slate-700"
            >
              <option value="">Choose finish...</option>
              {uniqueFinishes.map((finish: any) => (
                <option key={finish} value={finish}>
                  {finish.charAt(0).toUpperCase() + finish.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}

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
          disabled={isAddingToWishlist}
          className="flex-1 bg-slate-900 text-white py-4 rounded-lg hover:bg-slate-800 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAddingToWishlist ? "Adding..." : "Add to Wishlist"}
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
