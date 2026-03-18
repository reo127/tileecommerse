"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import dynamic from "next/dynamic";
import { WishlistButton } from "./WishlistButton";

const EnquiryModal = dynamic(
  () => import("../product-detail/EnquiryModal").then((mod) => ({ default: mod.EnquiryModal }))
);

interface HomeProductCardProps {
    product: {
        _id: string;
        name: string;
        category: string;
        image: string;
        price: number;
        cuttedPrice?: number;
        slug: string;
    };
}

export const HomeProductCard = ({ product }: HomeProductCardProps) => {
    const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

    return (
        <>
            <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200 hover:-translate-y-2">
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden bg-gray-100">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Enquire Button - Top Left (always show) */}
                    <div className="absolute top-3 left-3 z-10">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsEnquiryOpen(true);
                            }}
                            className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 text-xs font-semibold shadow-lg"
                        >
                            Enquire Now
                        </button>
                    </div>

                    {/* Wishlist Badge - Top Right */}
                    <div className="absolute top-3 right-3 z-10">
                        <WishlistButton productId={product._id} />
                    </div>

                    {/* Discount Badge - Top Left Below Enquire Button */}
                    {product.cuttedPrice && product.cuttedPrice > product.price && (
                        <div className="absolute top-14 left-3 z-10">
                            <span className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
                                {Math.round(((product.cuttedPrice - product.price) / product.cuttedPrice) * 100)}% OFF
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-5">
                    {/* Category */}
                    <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
                        {product.category}
                    </p>

                    {/* Product Name */}
                    <h3 className="font-semibold text-lg text-slate-900 mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-yellow-500 transition-colors">
                        {product.name}
                    </h3>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-4">
                        <p className="text-2xl font-bold text-yellow-600">
                            {product.price === 0 ? 'Get Price' : `₹${product.price.toLocaleString('en-IN')}`}
                        </p>
                        {product.price > 0 && product.cuttedPrice && product.cuttedPrice > product.price && (
                            <p className="text-sm text-gray-400 line-through">
                                ₹{product.cuttedPrice.toLocaleString('en-IN')}
                            </p>
                        )}
                    </div>

                    {/* View Details Button */}
                    <Link
                        href={`/product/${product.slug}`}
                        className="block w-full text-center px-4 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-yellow-500 hover:text-slate-900 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                        View Details
                    </Link>
                </div>
            </div>

            {/* Enquiry Modal */}
            <EnquiryModal
                isOpen={isEnquiryOpen}
                onClose={() => setIsEnquiryOpen(false)}
                product={{
                    id: product._id,
                    name: product.name,
                    price: product.price,
                    img: product.image,
                }}
            />
        </>
    );
};
