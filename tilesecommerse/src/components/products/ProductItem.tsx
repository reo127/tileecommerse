/** COMPONENTS */
import { ProductImage } from "./ProductImage";
import Link from "next/link";
/** FUNCTIONALITY */
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
/** TYPES */
import type { ProductWithVariants } from "@/schemas";

const WishlistButton = dynamic(
  () => import("../wishlist/WishlistButton")
);

interface ProductItemProps {
  product: ProductWithVariants;
}

export const ProductItem = ({ product }: ProductItemProps) => {
  const { name, id, img, price, category, variants } = product;

  const productLink = `/${category}/${id}?variant=${variants[0].color}`;

  return (
    <div className="group bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200">
      {/* Image Container */}
      <Link href={productLink} className="block relative overflow-hidden">
        <div className="relative aspect-[4/3]">
          <ProductImage
            image={img}
            name={name}
            width={400}
            height={400}
            sizes="(max-width: 640px) 100vw, (max-width: 1154px) 33vw, (max-width: 1536px) 25vw, 20vw"
          />
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
        </div>

        {/* Wishlist Button - Overlay on Image */}
        <div className="absolute top-3 right-3 z-10">
          <WishlistButton productId={id} />
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link href={productLink}>
          <h3 className="text-base font-semibold text-slate-800 mb-2 line-clamp-2 hover:text-orange-500 transition-colors min-h-[3rem]">
            {name}
          </h3>
        </Link>

        {/* Price and Size */}
        <div className="flex items-center justify-between mt-3">
          <div>
            {price > 0 ? (
              <>
                <p className="text-xl font-bold text-orange-500">₹{price.toFixed(0)}</p>
                <p className="text-xs text-gray-500">per unit</p>
              </>
            ) : (
              <>
                <p className="text-base font-semibold text-blue-600">Get Price</p>
                <p className="text-xs text-gray-500">Contact us</p>
              </>
            )}
          </div>

          {/* @ts-ignore - dummy data uses 'size', real schema uses 'sizes' */}
          {(variants[0]?.sizes?.[0] || variants[0]?.size) && (
            <div className="text-right">
              {/* @ts-ignore - dummy data uses 'size', real schema uses 'sizes' */}
              <p className="text-sm font-medium text-slate-700">{variants[0]?.sizes?.[0] || variants[0]?.size}"</p>
              <p className="text-xs text-gray-500">Size</p>
            </div>
          )}
        </div>

        {/* Color Variants */}
        {variants.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600 mb-2">{variants.length} Variant{variants.length > 1 ? 's' : ''} Available</p>
            <div className="flex flex-wrap gap-1.5">
              {variants.slice(0, 3).map((variant: any, idx: number) => (
                <span
                  key={idx}
                  className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded border border-gray-200"
                  title={variant.color}
                >
                  {variant.color}
                </span>
              ))}
              {variants.length > 3 && (
                <span className="px-2 py-1 text-xs font-medium bg-orange-50 text-orange-600 rounded border border-orange-200">
                  +{variants.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}


        {/* View Details Button */}
        <Link href={productLink}>
          <button className="w-full mt-4 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-orange-500 transition-colors duration-300 text-sm font-medium">
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
};
