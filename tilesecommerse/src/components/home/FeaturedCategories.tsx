import Link from "next/link";
import Image from "next/image";

const categories = [
  {
    name: "Ceramic Tiles",
    description: "Classic & versatile",
    image: "/product photos/subway-metro-tiles.jpg",
    href: "/ceramic",
    tag: "Popular",
    count: 45,
  },
  {
    name: "Vitrified Tiles",
    description: "High strength & low porosity",
    image: "/product photos/marble-look-tiles.jpg",
    href: "/porcelain",
    tag: "Trending",
    count: 38,
  },
  {
    name: "Wooden Look",
    description: "Natural wood finish",
    image: "/product photos/wooden-finish-floor-tiles.jpg",
    href: "/ceramic",
    tag: "New",
    count: 24,
  },
  {
    name: "Marble Finish",
    description: "Premium luxury tiles",
    image: "/product photos/premium-marble-look-tiles.webp",
    href: "/marble",
    tag: "Premium",
    count: 32,
  },
  {
    name: "Moroccan Tiles",
    description: "Artistic patterns",
    image: "/product photos/moroccan-patterntiles.webp",
    href: "/ceramic",
    tag: "Exclusive",
    count: 18,
  },
  {
    name: "Subway Tiles",
    description: "Modern metro style",
    image: "/product photos/glossy-white-wall-tiles.jpg",
    href: "/ceramic",
    tag: "Classic",
    count: 28,
  },
  {
    name: "Hexagon Tiles",
    description: "Contemporary geometric",
    image: "/product photos/hexagon-designer-tiles.jpg",
    href: "/porcelain",
    tag: "Trending",
    count: 22,
  },
  {
    name: "Terrazzo Tiles",
    description: "Vintage charm",
    image: "/product photos/premium-marble-look-tiles.webp",
    href: "/ceramic",
    tag: "Retro",
    count: 15,
  },
];

const tagColors: Record<string, string> = {
  Popular: "bg-blue-500",
  Trending: "bg-yellow-500",
  New: "bg-green-500",
  Premium: "bg-purple-500",
  Exclusive: "bg-pink-500",
  Classic: "bg-gray-700",
  Retro: "bg-amber-500",
};

export const FeaturedCategories = () => {
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
        {categories.map((category, index) => (
          <Link
            key={index}
            href={category.href}
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
