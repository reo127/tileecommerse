import Link from "next/link";
import Image from "next/image";

export const HeroBanner = () => {
  return (
    <section className="relative h-[500px] md:h-[600px] w-full overflow-hidden bg-slate-900">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1615971677499-5467cbab01c0?q=80&w=2000"
          alt="Premium Tiles Collection"
          fill
          className="object-cover opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/50" />
      </div>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Transform Your Space with Premium Tiles
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8">
            Discover our exclusive collection of high-quality tiles for your home and commercial spaces
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/ceramic"
              className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              Explore Collection
            </Link>
            <Link
              href="/search"
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg backdrop-blur-sm border border-white/20 transition-colors duration-200"
            >
              Browse Catalog
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
