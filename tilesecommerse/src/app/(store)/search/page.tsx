import { getProductsWithPagination, getAllProducts } from "@/app/actions";
import { pickFirst } from "@/utils";
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
    tags?: string | string[];
    finish?: string | string[];
    color?: string | string[];
    size?: string | string[];
    minPrice?: string;
    maxPrice?: string;
    roomType?: string | string[];
    page?: string;
    limit?: string;
  }>;
}

const Search = async ({ searchParams }: SearchProps) => {
  const params = await searchParams;
  const q = pickFirst(params, "q");

  // Get pagination params
  const page = parseInt(params.page || '1');
  const limit = parseInt(params.limit || '12');

  // Get filter params
  const categories = params.category ? (Array.isArray(params.category) ? params.category : [params.category]) : [];
  const tags = params.tags ? (Array.isArray(params.tags) ? params.tags : [params.tags]) : [];
  const finishes = params.finish ? (Array.isArray(params.finish) ? params.finish : [params.finish]) : [];
  const colors = params.color ? (Array.isArray(params.color) ? params.color : [params.color]) : [];
  const roomTypes = params.roomType ? (Array.isArray(params.roomType) ? params.roomType : [params.roomType]) : [];
  const sizes = params.size ? (Array.isArray(params.size) ? params.size : [params.size]) : [];
  const minPrice = params.minPrice ? parseFloat(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : undefined;

  // Fetch products with server-side pagination
  const paginationData = await getProductsWithPagination({
    page,
    limit,
    keyword: q,
    category: categories[0], // Backend supports single category
    minPrice,
    maxPrice
  });

  // For filters sidebar, we still need all products to show available options
  // This is a one-time fetch for filter options only
  const allProducts = await getAllProducts();

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
            allProducts={allProducts}
            selectedCategories={categories}
            selectedTags={tags}
            selectedFinishes={finishes}
            selectedColors={colors}
            selectedRoomTypes={roomTypes}
            selectedSizes={sizes}
            minPrice={minPrice}
            maxPrice={maxPrice}
          />

          {/* Product Grid with Server-Side Pagination */}
          <ProductGrid
            products={paginationData.products}
            totalProducts={paginationData.totalProducts}
            totalPages={paginationData.totalPages}
            currentPage={paginationData.currentPage}
            searchQuery={q}
          />
        </div>
      </div>
    </div>
  );
};

export default Search;
