"use server";

import Link from "next/link";
import Image from "next/image";
import { WishlistButton } from "./WishlistButton";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1';

async function getBestSellerProducts() {
    try {
        // Fetch all products
        const response = await fetch(`${API_BASE_URL}/products/all`, {
            next: { revalidate: 300 }, // Cache for 5 minutes
        });

        if (!response.ok) {
            console.error('Failed to fetch products');
            return [];
        }

        const result = await response.json();
        const products = result.products || [];

        console.log(`📦 Fetched ${products.length} total products for Best Seller Products`);

        // Filter products that have the 'bestseller' tag
        const bestSellerProducts = products.filter((p: any) =>
            p.tags && Array.isArray(p.tags) && p.tags.includes('bestseller')
        );

        console.log(`🏆 Found ${bestSellerProducts.length} best seller products`);

        // Randomly shuffle and take 8 products
        const shuffled = bestSellerProducts.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 8);

        console.log(`✅ Selected ${selected.length} random best seller products`);

        return selected.map((product: any) => ({
            _id: product._id,
            name: product.name,
            category: product.category?.name || 'Tiles',
            image: product.images?.[0]?.url || '/placeholder.jpg',
            price: product.price,
            cuttedPrice: product.cuttedPrice,
            slug: product.slug || product._id,
            hasVariants: product.variants && product.variants.length > 1,
            variantId: product.variants?.[0]?.id || product.id,
            stripeId: product.stripeId || product.variants?.[0]?.stripeId,
            size: product.size || 'default',
        }));
    } catch (error) {
        console.error('Error fetching best seller products:', error);
        return [];
    }
}

export const BestSeller = async () => {
    const products = await getBestSellerProducts();

    if (products.length === 0) {
        return (
            <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
                <div className="mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
                        Best Seller Products
                    </h2>
                    <p className="text-slate-600 text-lg">
                        Top-rated and most loved tile collections
                    </p>
                </div>
                <div className="text-center py-12 bg-slate-50 rounded-2xl">
                    <p className="text-slate-600">No best seller products available yet. Add products with the &apos;bestseller&apos; tag to see them here.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
            {/* Header */}
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
                        Best Seller Products
                    </h2>
                    <p className="text-slate-600 text-lg">
                        Top-rated and most loved tile collections
                    </p>
                </div>
                <Link
                    href="/search?tags=bestseller"
                    className="hidden md:block text-yellow-500 hover:text-yellow-600 font-semibold transition-colors"
                >
                    View All →
                </Link>
            </div>

            {/* Products Grid - 4 columns × 2 rows */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product: any) => (
                    <div
                        key={product._id}
                        className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200 hover:-translate-y-2"
                    >
                        {/* Image Container */}
                        <div className="relative h-64 overflow-hidden bg-gray-100">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />

                            {/* Wishlist Badge - Top Right */}
                            <div className="absolute top-3 right-3 z-10">
                                <WishlistButton productId={product._id} />
                            </div>

                            {/* Discount Badge - Top Left */}
                            {product.cuttedPrice && product.cuttedPrice > product.price && (
                                <div className="absolute top-3 left-3">
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
                ))}
            </div>

            {/* View All Mobile */}
            <div className="mt-8 text-center md:hidden">
                <Link
                    href="/search?tags=bestseller"
                    className="inline-block px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                    View All Best Seller Products
                </Link>
            </div>
        </section>
    );
};
