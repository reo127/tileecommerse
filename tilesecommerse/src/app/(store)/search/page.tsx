import { getAllProducts } from "@/app/actions";
import { pickFirst, searchProducts } from "@/utils";
import { FilterSidebar, ProductGrid, Breadcrumb } from "@/components/search";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Products - SLN TILES SHOWROOM",
  description: "Browse our complete collection of premium tiles, sanitary ware, and home improvement products.",
};

interface SearchProps {
  searchParams: Promise<{
    q?: string;
    category?: string | string[];
    material?: string | string[];
    finish?: string | string[];
    color?: string | string[];
    minPrice?: string;
    maxPrice?: string;
    roomType?: string | string[];
  }>;
}

const Search = async ({ searchParams }: SearchProps) => {
  const params = await searchParams;
  const q = pickFirst(params, "q");

  // Get filter params
  const categories = params.category ? (Array.isArray(params.category) ? params.category : [params.category]) : [];
  const materials = params.material ? (Array.isArray(params.material) ? params.material : [params.material]) : [];
  const finishes = params.finish ? (Array.isArray(params.finish) ? params.finish : [params.finish]) : [];
  const colors = params.color ? (Array.isArray(params.color) ? params.color : [params.color]) : [];
  const roomTypes = params.roomType ? (Array.isArray(params.roomType) ? params.roomType : [params.roomType]) : [];
  const minPrice = params.minPrice ? parseFloat(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : undefined;

  // Fetch products from backend
  const products = await getAllProducts();

  // Apply search query filter
  let filteredProducts = searchProducts(products, q);

  // Apply category filter
  if (categories.length > 0) {
    filteredProducts = filteredProducts.filter(p =>
      categories.includes(p.category)
    );
  }

  // Apply material filter
  if (materials.length > 0) {
    filteredProducts = filteredProducts.filter(p =>
      p.material && materials.includes(p.material)
    );
  }

  // Apply finish filter
  if (finishes.length > 0) {
    filteredProducts = filteredProducts.filter(p =>
      p.finish && finishes.includes(p.finish)
    );
  }

  // Apply color filter
  if (colors.length > 0) {
    filteredProducts = filteredProducts.filter(p =>
      p.color && colors.some(color => p.color?.toLowerCase().includes(color.toLowerCase()))
    );
  }

  // Apply room type filter
  if (roomTypes.length > 0) {
    filteredProducts = filteredProducts.filter(p =>
      p.roomType && p.roomType.some((rt: string) => roomTypes.includes(rt))
    );
  }

  // Apply price range filter
  if (minPrice !== undefined || maxPrice !== undefined) {
    filteredProducts = filteredProducts.filter(p => {
      if (minPrice !== undefined && p.price < minPrice) return false;
      if (maxPrice !== undefined && p.price > maxPrice) return false;
      return true;
    });
  }

  const breadcrumbItems = [
    { label: "Products", href: "/search" },
    ...(q ? [{ label: q, href: `/search?q=${q}` }] : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Main Content: Sidebar + Products */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <FilterSidebar
            allProducts={products}
            selectedCategories={categories}
            selectedMaterials={materials}
            selectedFinishes={finishes}
            selectedColors={colors}
            selectedRoomTypes={roomTypes}
            minPrice={minPrice}
            maxPrice={maxPrice}
          />

          {/* Product Grid */}
          <ProductGrid products={filteredProducts} searchQuery={q} />
        </div>
      </div>
    </div>
  );
};

export default Search;
