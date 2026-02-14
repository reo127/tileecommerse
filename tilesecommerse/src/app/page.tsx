export const dynamic = 'force-dynamic';
import {
  HeroSlider,
  CollectionGrid,
  PopularProducts,
  TrendingProducts,
  NewProducts,
  PremiumProducts,
  ExclusiveProducts,
  ClassicProducts,
  BestSeller,
  LimitedEdition,
  Testimonials,
} from "@/components/home";

const Home = async () => {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Slider */}
      <HeroSlider />

      {/* Collection Grid - Shop by Room */}
      <CollectionGrid />

      {/* Popular Products */}
      <PopularProducts />

      {/* Trending Products */}
      <TrendingProducts />

      {/* New Products */}
      <NewProducts />

      {/* Premium Products */}
      <PremiumProducts />

      {/* Exclusive Products */}
      <ExclusiveProducts />

      {/* Classic Products */}
      <ClassicProducts />

      {/* Best Seller Products */}
      <BestSeller />

      {/* Limited Edition Products */}
      <LimitedEdition />

      {/* Testimonials */}
      <Testimonials />
    </main>
  );
};

export default Home;
