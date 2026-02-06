"use client";

import type { ProductWithVariants } from "@/schemas";
import {
  ProductImageGallery,
  ProductInfo,
  ProductSpecifications,
  ProductDetailsTabs,
  FAQSection,
  PreviouslyViewed
} from "@/components/product-detail";

interface ProductDetailClientProps {
  product: ProductWithVariants;
  productImages: string[];
}

export const ProductDetailClient = ({ product, productImages }: ProductDetailClientProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Product Section - Image Gallery + Product Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left: Image Gallery */}
          <ProductImageGallery
            images={productImages}
            productName={product.name}
          />

          {/* Right: Product Info */}
          <ProductInfo product={product} />
        </div>

        {/* Product Specifications */}
        <div className="mb-8">
          <ProductSpecifications product={product} />
        </div>

        {/* Product Details Tabs */}
        <div className="mb-8">
          <ProductDetailsTabs product={product} />
        </div>

        {/* FAQ Section */}
        <div className="mb-8">
          <FAQSection />
        </div>

        {/* Previously Viewed */}
        <div className="mb-8">
          <PreviouslyViewed currentProductId={product.id} />
        </div>
      </div>
    </div>
  );
};
