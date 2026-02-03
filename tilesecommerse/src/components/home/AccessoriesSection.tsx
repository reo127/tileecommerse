"use server";

import Link from "next/link";
import Image from "next/image";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1';

// You can change this to any category slug from your database
const CATEGORY_SLUG = 'accessories'; // Change this to match your category

async function getCategoryProducts() {
  try {
    // First, get all categories to find the one we want
    const categoriesResponse = await fetch(`${API_BASE_URL}/categories`, {
      cache: 'no-store',
    });

    if (!categoriesResponse.ok) {
      console.error('Failed to fetch categories');
      return { products: [], categoryName: 'Accessories', categorySlug: CATEGORY_SLUG };
    }

    const categoriesResult = await categoriesResponse.json();
    const categories = categoriesResult.categories || [];

    // Find the category by slug
    const category = categories.find((cat: any) => cat.slug === CATEGORY_SLUG);

    if (!category) {
      console.log(`Category with slug "${CATEGORY_SLUG}" not found`);
      return { products: [], categoryName: 'Accessories', categorySlug: CATEGORY_SLUG };
    }

    // Now get products for this category
    const productsResponse = await fetch(
      `${API_BASE_URL}/products?category=${category._id}`,
      { cache: 'no-store' }
    );

    if (!productsResponse.ok) {
      console.error('Failed to fetch products');
      return { products: [], categoryName: category.name, categorySlug: category.slug };
    }

    const productsResult = await productsResponse.json();
    const products = productsResult.products || [];

    // Take first 6 products
    const limitedProducts = products.slice(0, 6).map((product: any) => ({
      _id: product._id,
      name: product.name,
      description: product.shortDescription || product.description?.substring(0, 100) || 'Quality product',
      image: product.images?.[0]?.url || '/placeholder.jpg',
      price: product.price,
      stock: product.stock > 0 ? 'In Stock' : 'Out of Stock',
      slug: product.slug || product._id,
    }));

    return {
      products: limitedProducts,
      categoryName: category.name,
      categorySlug: category.slug,
    };
  } catch (error) {
    console.error('Error fetching category products:', error);
    return { products: [], categoryName: 'Accessories', categorySlug: CATEGORY_SLUG };
  }
}

const AccessoryCard = ({ accessory }: { accessory: any }) => {
  return (
    <Link
      href={`/product/${accessory.slug}`}
      className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden bg-gray-100">
        <Image
          src={accessory.image}
          alt={accessory.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Add to Cart overlay on hover */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="px-3 py-1.5 bg-yellow-500 text-white text-sm font-semibold rounded-lg hover:bg-yellow-600 transition-colors shadow-lg">
            Add to Cart
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <h3 className="font-bold text-slate-900 mb-1 group-hover:text-yellow-500 transition-colors">
            {accessory.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {accessory.description}
          </p>
          <span className={`text-xs font-semibold ${accessory.stock === "In Stock" ? "text-green-600" : "text-red-600"}`}>
            {accessory.stock}
          </span>
        </div>
        <p className="text-xl font-bold text-yellow-600 mt-2">
          ₹{accessory.price}
        </p>
      </div>
    </Link>
  );
};

export const AccessoriesSection = async () => {
  const { products, categoryName, categorySlug } = await getCategoryProducts();

  if (products.length === 0) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
              {categoryName}
            </h2>
            <p className="text-slate-600 text-lg">
              Everything you need for perfect tile installation
            </p>
          </div>
        </div>
        <div className="text-center py-12 bg-slate-50 rounded-2xl">
          <p className="text-slate-600">No products available in this category yet.</p>
          <p className="text-sm text-slate-500 mt-2">
            Looking for category: <strong>{CATEGORY_SLUG}</strong>
          </p>
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
            {categoryName}
          </h2>
          <p className="text-slate-600 text-lg">
            Everything you need for perfect tile installation
          </p>
        </div>
        <Link
          href={`/${categorySlug}`}
          className="hidden md:block text-yellow-500 hover:text-yellow-600 font-semibold transition-colors"
        >
          View All →
        </Link>
      </div>

      {/* Accessories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((accessory: any) => (
          <AccessoryCard key={accessory._id} accessory={accessory} />
        ))}
      </div>

      {/* View All Mobile */}
      <div className="mt-8 text-center md:hidden">
        <Link
          href={`/${categorySlug}`}
          className="inline-block px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          View All {categoryName}
        </Link>
      </div>
    </section>
  );
};
