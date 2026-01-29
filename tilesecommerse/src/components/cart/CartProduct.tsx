/** COMPONENTS */
import { ProductImage } from "../products/ProductImage";
import Link from "next/link";
import { DeleteButton } from "./DeleteButton";
import { ProductCartInfo } from "./ProductCartInfo";
/** TYPES */
import type { CartItem, ProductVariant, ProductWithVariants } from "@/schemas";

interface CartProductProps {
  product: ProductWithVariants;
  cartItemId: CartItem["id"];
  size: CartItem["size"];
  quantity: CartItem["quantity"];
  variant: ProductVariant;
}

export const CartProduct = ({
  product,
  cartItemId,
  size,
  quantity,
  variant,
}: CartProductProps) => {
  const { name, price, category, id, cuttedPrice } = product;
  const productLink = `/${category}/${id}?variant=${variant.color}`;

  // Calculate discount if cuttedPrice exists
  const discount = cuttedPrice ? Math.round(((cuttedPrice - price) / cuttedPrice) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex gap-4 md:gap-6 items-start transition-all hover:shadow-md">
      {/* Product Image */}
      <Link href={productLink} className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-slate-100 relative group">
        <ProductImage
          image={variant.images[0]}
          name={name}
          width={128}
          height={128}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="128px"
        />
      </Link>

      {/* Product Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between h-auto md:h-32 py-1">
        <div>
          <div className="flex justify-between items-start gap-4">
            <div>
              <Link href={productLink} className="hover:text-orange-600 transition-colors">
                <h3 className="text-base md:text-lg font-bold text-slate-900 line-clamp-2 md:line-clamp-1">
                  {name}
                </h3>
              </Link>
              <div className="text-sm text-slate-500 mt-1 capitalize">
                Category: {category}
              </div>
            </div>

            <div className="text-right">
              <div className="text-lg font-bold text-slate-900">
                €{price.toFixed(2)}
              </div>
              {cuttedPrice && cuttedPrice > price && (
                <div className="text-sm text-slate-400 line-through">
                  €{cuttedPrice.toFixed(2)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-end justify-between mt-4 md:mt-0">
          <ProductCartInfo
            cartItemId={cartItemId}
            size={size}
            quantity={quantity}
            color={variant.color}
          />

          <DeleteButton cartItemId={cartItemId} />
        </div>
      </div>
    </div>
  );
};
