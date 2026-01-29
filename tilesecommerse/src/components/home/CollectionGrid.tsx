import Link from "next/link";
import Image from "next/image";

const collections = [
  {
    title: "Bathroom Tiles",
    description: "Water-resistant & elegant designs",
    image: "/product photos/bathroom-tiles.jpg",
    href: "/ceramic",
  },
  {
    title: "Kitchen Tiles",
    description: "Heat-resistant & easy to clean",
    image: "/product photos/kitchen-tile.jpg",
    href: "/ceramic",
  },
  {
    title: "Living Room",
    description: "Modern & stylish floor tiles",
    image: "/product photos/living-room-tiles.jpg",
    href: "/porcelain",
  },
  {
    title: "Outdoor Tiles",
    description: "Weather-resistant & durable",
    image: "/product photos/outdoor-tiles.jpg",
    href: "/porcelain",
  },
  {
    title: "Wall Tiles",
    description: "Decorative & contemporary",
    image: "/product photos/wall-tiles.jpg",
    href: "/ceramic",
  },
  {
    title: "Marble Look",
    description: "Luxury marble finish tiles",
    image: "/product photos/marble-look-tiles.jpg",
    href: "/marble",
  },
];

export const CollectionGrid = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
          Shop by Room
        </h2>
        <p className="text-slate-600 text-lg">
          Find the perfect tiles for every space in your home
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection, index) => (
          <Link
            key={index}
            href={collection.href}
            className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
          >
            <div className="relative h-64 overflow-hidden">
              <Image
                src={collection.image}
                alt={collection.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

              {/* Icon overlay on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/50">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-2xl font-bold mb-2 group-hover:text-yellow-400 transition-colors">{collection.title}</h3>
              <p className="text-gray-200 text-sm">{collection.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
