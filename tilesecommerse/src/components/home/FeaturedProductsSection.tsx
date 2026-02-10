"use server";

import Link from "next/link";
import Image from "next/image";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1';

const tagColors: Record<string, string> = {
  popular: "bg-blue-500",
  trending: "bg-yellow-500",
  new: "bg-green-500",
  premium: "bg-purple-500",
  exclusive: "bg-pink-500",
  classic: "bg-gray-700",
  bestseller: "bg-orange-500",
  limited: "bg-red-500",
};

async function getFeaturedProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/products?limit=30`, {
      next: { revalidate: 300 }, // Cache for 5 minutes, limit to 30 products
    });

    if (!response.ok) {
      console.error('Failed to fetch products');
      return [];
    }

    const result = await response.json();
    const products = result.products || [];

    // Filter products that have style tags
    const styleTags = ['popular', 'trending', 'new', 'premium', 'exclusive', 'classic', 'bestseller', 'limited'];
    const productsWithTags = products.filter((p: any) =>
      p.tags && Array.isArray(p.tags) && p.tags.some((tag: string) => styleTags.includes(tag))
    );

    // Take first 8 products with tags
    return productsWithTags.slice(0, 8).map((product: any) => {
      // Find the first style tag
      const tag = product.tags.find((t: string) => styleTags.includes(t)) || 'popular';

      return {
        _id: product._id,
        name: product.name,
        category: product.category?.name || 'Tiles',
        image: product.images?.[0]?.url || '/placeholder.jpg',
        price: product.price,
        tag,
        slug: product.slug || product._id,
      };
    });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

const ProductCard = ({ product }: { product: any }) => {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2"
    >
      {/* Image Container */}
      <div className="relative h-48 md:h-56 overflow-hidden bg-gray-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Tag */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1.5 ${tagColors[product.tag] || 'bg-yellow-500'} text-white text-xs font-bold rounded-full shadow-lg capitalize`}>
            {product.tag}
          </span>
        </div>

        {/* Quick View & Add to Cart on Hover */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="px-4 py-2 bg-white text-slate-900 font-semibold rounded-lg hover:bg-yellow-500 hover:text-white transition-colors shadow-lg">
            Quick View
          </button>
          <button className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors shadow-lg">
            Add to Cart
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-gray-500 mb-1">{product.category}</p>
        <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-yellow-500 transition-colors">
          {product.name}
        </h3>

        <p className="text-xl font-bold text-yellow-600">
          {product.price === 0 ? 'Get Price' : `₹${product.price}`}
        </p>
      </div>
    </Link>
  );
};

export const FeaturedProductsSection = async () => {
  const products = await getFeaturedProducts();

  if (products.length === 0) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
              Featured Products
            </h2>
            <p className="text-slate-600 text-lg">
              Hand-picked tiles for your dream space
            </p>
          </div>
        </div>
        <div className="text-center py-12 bg-slate-50 rounded-2xl">
          <p className="text-slate-600">No featured products available yet. Add products with style tags to see them here.</p>
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
            Featured Products
          </h2>
          <p className="text-slate-600 text-lg">
            Hand-picked tiles for your dream space
          </p>
        </div>
        <Link
          href="/search"
          className="hidden md:block text-yellow-500 hover:text-yellow-600 font-semibold transition-colors"
        >
          View All →
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product: any) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* View All Mobile */}
      <div className="mt-8 text-center md:hidden">
        <Link
          href="/search"
          className="inline-block px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          View All Products
        </Link>
      </div>
    </section>
  );
};
