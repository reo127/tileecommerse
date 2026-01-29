"use client";

import Link from "next/link";
import Image from "next/image";

const featuredProducts = [
  {
    id: 1,
    name: "Premium Marble Look Tiles",
    category: "marble",
    displayCategory: "Vitrified Tiles",
    image: "/product photos/premium-marble-look-tiles.webp",
    price: "₹89/sq.ft",
    tag: "Bestseller",
    href: "/marble/1?variant=white",
    color: "white",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Wooden Finish Floor Tiles",
    category: "ceramic",
    displayCategory: "Ceramic Tiles",
    image: "/product photos/wooden-finish-floor-tiles.jpg",
    price: "₹65/sq.ft",
    tag: "New",
    href: "/ceramic/2?variant=brown",
    color: "brown",
    rating: 4.6,
  },
  {
    id: 3,
    name: "Moroccan Pattern Tiles",
    category: "ceramic",
    displayCategory: "Designer Tiles",
    image: "/product photos/moroccan-patterntiles.webp",
    price: "₹95/sq.ft",
    tag: "Trending",
    href: "/ceramic/3?variant=blue",
    color: "blue",
    rating: 4.9,
  },
  {
    id: 4,
    name: "Glossy White Wall Tiles",
    category: "ceramic",
    displayCategory: "Ceramic Wall Tiles",
    image: "/product photos/glossy-white-wall-tiles.jpg",
    price: "₹45/sq.ft",
    tag: "Popular",
    href: "/ceramic/4?variant=white",
    color: "white",
    rating: 4.7,
  },
  {
    id: 5,
    name: "Granite Look Tiles",
    category: "porcelain",
    displayCategory: "Vitrified Tiles",
    image: "/product photos/marble-look-tiles.jpg",
    price: "₹78/sq.ft",
    tag: "Premium",
    href: "/porcelain/5?variant=gray",
    color: "gray",
    rating: 4.5,
  },
  {
    id: 6,
    name: "Hexagon Designer Tiles",
    category: "porcelain",
    displayCategory: "Wall Tiles",
    image: "/product photos/hexagon-designer-tiles.jpg",
    price: "₹105/sq.ft",
    tag: "Exclusive",
    href: "/porcelain/6?variant=black",
    color: "black",
    rating: 4.9,
  },
  {
    id: 7,
    name: "Anti-Skid Outdoor Tiles",
    category: "porcelain",
    displayCategory: "Outdoor Tiles",
    image: "/product photos/anti-skid-outdoor-tiles.jpg",
    price: "₹72/sq.ft",
    tag: "Durable",
    href: "/porcelain/7?variant=beige",
    color: "beige",
    rating: 4.8,
  },
  {
    id: 8,
    name: "Subway Metro Tiles",
    category: "ceramic",
    displayCategory: "Wall Tiles",
    image: "/product photos/subway-metro-tiles.jpg",
    price: "₹55/sq.ft",
    tag: "Classic",
    href: "/ceramic/8?variant=white",
    color: "white",
    rating: 4.6,
  },
];

const ProductCard = ({ product }: { product: typeof featuredProducts[0] }) => {
  return (
    <Link
      href={product.href}
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
          <span className="px-3 py-1.5 bg-yellow-500 text-white text-xs font-bold rounded-full shadow-lg">
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
        <p className="text-xs text-gray-500 mb-1">{product.displayCategory}</p>
        <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-yellow-500 transition-colors">
          {product.name}
        </h3>

        {/* Rating Stars */}
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-xs text-gray-600 ml-1">({product.rating})</span>
        </div>

        <p className="text-xl font-bold text-yellow-600">{product.price}</p>
      </div>
    </Link>
  );
};

export const FeaturedProductsSection = () => {
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
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
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
