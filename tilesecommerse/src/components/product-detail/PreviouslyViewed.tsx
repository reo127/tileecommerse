import Image from "next/image";
import Link from "next/link";

export const PreviouslyViewed = () => {
  const products = [
    {
      id: "1",
      name: "Italian Beige (Matt)",
      price: 92,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1615873968403-89e068629265?w=400",
    },
    {
      id: "2",
      name: "Wooden Walnut Tiles",
      price: 78,
      rating: 4.3,
      image: "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400",
    },
    {
      id: "3",
      name: "Royal Marble Look Tiles",
      price: 105,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=400",
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Previously Viewed</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <Link href={`/product/${product.id}`} className="block">
              <div className="relative aspect-square bg-gray-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>
            <div className="p-4">
              <Link href={`/product/${product.id}`}>
                <h3 className="font-semibold text-slate-800 mb-2 hover:text-orange-500 transition-colors line-clamp-2 min-h-[3rem]">
                  {product.name}
                </h3>
              </Link>
              <div className="flex items-center gap-1 mb-2">
                <div className="flex text-orange-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-current" : "fill-gray-300"}`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-gray-600">({product.rating})</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-bold text-orange-500">₹{product.price}</p>
                  <p className="text-xs text-gray-500">per sq.ft</p>
                </div>
                <Link href={`/product/${product.id}`}>
                  <button className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-orange-500 transition-colors text-sm font-medium">
                    View Item
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
