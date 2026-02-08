export const dynamic = 'force-dynamic';
import { Suspense } from "react";
import { getAllProducts } from "./actions";
import { ErrorBoundary } from "react-error-boundary";
import {
  ProductsSkeleton,
  GridProducts,
  ProductItem,
} from "@/components/products";
import {
  HeroSlider,
  CollectionGrid,
  Testimonials,
  FeaturedCategories,
  FeaturedProductsSection,
  AccessoriesSection,
  LatestBlogs,
} from "@/components/home";

const Home = async () => {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Slider */}
      <HeroSlider />

      {/* Collection Grid - Shop by Room */}
      <CollectionGrid />

      {/* Featured Categories */}
      <div className="bg-gray-50 py-1">
        <FeaturedCategories />
      </div>

      {/* Featured Products Section */}
      <FeaturedProductsSection />



      {/* Accessories Section */}
      <AccessoriesSection />

      {/* Database Products Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
            Our Collection
          </h2>
          <p className="text-slate-600 text-lg">
            Explore our complete range of premium tiles
          </p>
        </div>
        <ErrorBoundary fallback={<ErrorComponent />}>
          <Suspense fallback={<ProductsSkeleton items={12} />}>
            <AllProducts />
          </Suspense>
        </ErrorBoundary>
      </section>

      {/* Latest Blogs */}
      <LatestBlogs />

      {/* Testimonials */}
      <Testimonials />
    </main>
  );
};

const ErrorComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[30vh] bg-red-50 rounded-2xl p-8">
      <h2 className="text-xl font-bold text-red-900">Oops! Something went wrong</h2>
      <p className="mt-2 text-red-700">
        We couldn&apos;t load the products. Please try again later.
      </p>
    </div>
  );
};

const AllProducts = async () => {
  const products = await getAllProducts();

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[30vh] bg-slate-50 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-slate-900">No products available</h2>
        <p className="mt-2 text-gray-600">
          Check back later to see our products
        </p>
      </div>
    );
  }

  return (
    <GridProducts>
      {products.slice(0, 12).map((product: any) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </GridProducts>
  );
};

export default Home;
