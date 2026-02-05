"use client";

import { useState } from "react";
import { useCartMutation } from "@/hooks/cart";
import { useWishlistMutation } from "@/hooks/wishlist";
import { useSession } from "@/lib/auth/client";
import { toast } from "sonner";
import type { ProductWithVariants } from "@/schemas";
import { EnquiryModal } from "./EnquiryModal";

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
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);


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

        {/* Product ID - Display variant ID if available, otherwise main product ID */}
        {(selectedVariant?.productId || product.productId) && (
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-300 rounded-lg">
            <span className="text-xs font-medium text-slate-600">Product ID:</span>
            <span className="text-sm font-semibold text-slate-900">{selectedVariant?.productId || product.productId}</span>
          </div>
        )}
      </div>

      {/* Price with MRP and Discount */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-baseline gap-3 mb-1">
          <span className="text-sm text-slate-600">Price:</span>
          {currentPrice > 0 ? (
            <>
              <span className="text-3xl font-bold text-orange-500">₹{currentPrice.toFixed(0)}</span>
              {currentMRP && currentMRP > currentPrice && (
                <>
                  <span className="text-lg text-slate-400 line-through">₹{currentMRP.toFixed(0)}</span>
                  <span className="text-sm font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
                    {Math.round(((currentMRP - currentPrice) / currentMRP) * 100)}% OFF
                  </span>
                </>
              )}
              <span className="text-sm text-slate-600">/ unit</span>
            </>
          ) : (
            <>
              <span className="text-2xl font-bold text-blue-600">Get Price</span>
              <span className="text-sm text-slate-600">Contact us for pricing</span>
            </>
          )}
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
                className="w-20 text-center py-2 font-semibold text-slate-800 focus:outline-none bg-white"
                min="1"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 text-xl font-semibold text-slate-700 hover:bg-gray-100 transition-colors"
              >
                +
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Total Price */}
      <div className="bg-slate-900 text-white rounded-lg p-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm">Total Price:</span>
          <span className="text-2xl font-bold">₹{(currentPrice * quantity).toFixed(0)}</span>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {/* Wishlist - 10% width - Heart Icon Only */}
        <button
          onClick={handleAddToWishlist}
          disabled={isAddingToWishlist}
          className="w-[10%] bg-slate-900 text-white py-4 rounded-lg hover:bg-slate-800 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          title="Add to Wishlist"
        >
          {isAddingToWishlist ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* Enquire Now - 40% width (or 90% if no price) */}
        <button
          onClick={() => setIsEnquiryModalOpen(true)}
          className={`${!product.price || product.price === 0 ? 'w-[90%] bg-orange-500 hover:bg-orange-600' : 'w-[40%] bg-blue-600 hover:bg-blue-700'} text-white py-4 rounded-lg transition-colors font-semibold text-lg flex items-center justify-center gap-2`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          {!product.price || product.price === 0 ? 'Enquire for Price' : 'Enquire Now'}
        </button>

        {/* Add to Cart - 50% width - Only shown if price is available */}
        {product.price && product.price > 0 ? (
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="w-[50%] bg-orange-500 text-white py-4 rounded-lg hover:bg-orange-600 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isAdding ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add to Cart
              </>
            )}
          </button>
        ) : null}
      </div>

      {/* Price on Request Message - Only shown if no price */}
      {(!product.price || product.price === 0) && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 text-center">
            💡 <strong>Price on Request</strong> - Contact us for the best quote!
          </p>
        </div>
      )}

      {/* Contact Buttons - WhatsApp & Call */}
      <div className="mt-4 flex gap-3">
        {/* WhatsApp Button */}
        <a
          href={`https://wa.me/919738522119?text=Hi, I'm interested in *${encodeURIComponent(product.name)}*%0A%0AProduct Link: ${encodeURIComponent(window.location.href)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold text-lg"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          WhatsApp
        </a>

        {/* Phone Call Button */}
        <a
          href="tel:+919738522119"
          className="flex-1 flex items-center justify-center gap-2 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold text-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Call Us
        </a>
      </div>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        product={product}
      />
    </div>
  );
};
