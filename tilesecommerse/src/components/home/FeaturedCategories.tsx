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

async function getFeaturedCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to fetch categories');
      return [];
    }

    const result = await response.json();
    const categories = result.categories || [];

    // Get only top-level categories (no parent)
    const topLevelCategories = categories.filter((cat: any) => !cat.parent);

    // Get products count and first product image for each category
    const categoriesWithData = await Promise.all(
      topLevelCategories.map(async (category: any) => {
        try {
          const productsResponse = await fetch(
            `${API_BASE_URL}/products?category=${category._id}`,
            { cache: 'no-store' }
          );

          if (!productsResponse.ok) {
            return {
              ...category,
              count: 0,
              image: '/placeholder.jpg',
              tag: 'popular',
            };
          }

          const productsResult = await productsResponse.json();
          const products = productsResult.products || [];

          // Get the first product's image or use placeholder
          const firstProductImage = products[0]?.images?.[0]?.url || '/placeholder.jpg';

          // Determine tag based on product tags
          let tag = 'popular';
          if (products.length > 0 && products[0].tags && products[0].tags.length > 0) {
            // Use the first style tag from the first product
            const styleTags = ['trending', 'new', 'premium', 'exclusive', 'classic', 'bestseller', 'limited', 'popular'];
            const foundTag = products[0].tags.find((t: string) => styleTags.includes(t));
            if (foundTag) tag = foundTag;
          }

          return {
            _id: category._id,
            name: category.name,
            description: category.description || 'Explore our collection',
            slug: category.slug,
            image: firstProductImage,
            count: products.length,
            tag,
          };
        } catch (error) {
          console.error(`Error fetching products for category ${category.name}:`, error);
          return {
            ...category,
            count: 0,
            image: '/placeholder.jpg',
            tag: 'popular',
          };
        }
      })
    );

    // Sort by product count and take top 8
    return categoriesWithData
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export const FeaturedCategories = async () => {
  const categories = await getFeaturedCategories();

  if (categories.length === 0) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
            Popular Categories
          </h2>
          <p className="text-slate-600 text-lg">
            Explore our best-selling tile collections
          </p>
        </div>
        <div className="text-center py-12 bg-slate-50 rounded-2xl">
          <p className="text-slate-600">No categories available yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
          Popular Categories
        </h2>
        <p className="text-slate-600 text-lg">
          Explore our best-selling tile collections
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {categories.map((category: any, index: number) => (
          <Link
            key={category._id || index}
            href={`/${category.slug}`}
            className="group relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
          >
            {/* Tag with icon */}
            <div className="absolute top-3 left-3 z-10">
              <span className={`px-4 py-1.5 ${tagColors[category.tag] || "bg-yellow-500"} text-white text-sm font-bold rounded-full shadow-lg flex items-center gap-1`}>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {category.tag}
              </span>
            </div>

            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-yellow-500 transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{category.description}</p>
              <p className="text-xs text-gray-500 font-medium">
                {category.count} products
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
