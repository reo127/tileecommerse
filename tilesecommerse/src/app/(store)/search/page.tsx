import { getAllProducts } from "@/app/actions";
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

  // Fetch ALL products (we'll filter client-side)
  const allProducts = await getAllProducts();

  // Fetch categories to get proper hierarchy
  const categoriesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1'}/categories`);
  const categoriesData = await categoriesResponse.json();
  const dbCategories = categoriesData.categories || [];

  // Helper function to recursively get all descendant category slugs
  const getAllDescendantSlugs = (category: any): string[] => {
    const slugs = [category.slug];
    if (category.children && category.children.length > 0) {
      category.children.forEach((child: any) => {
        slugs.push(...getAllDescendantSlugs(child));
      });
    }
    return slugs;
  };

  // Build a map of parent category slug -> all descendant slugs (including itself)
  const categorySlugMap = new Map<string, string[]>();
  dbCategories.forEach((category: any) => {
    const allSlugs = getAllDescendantSlugs(category);
    categorySlugMap.set(category.slug, allSlugs);
  });

  // Client-side filtering
  let filteredProducts = allProducts;

  // Filter by search query
  if (q) {
    const searchLower = q.toLowerCase();
    filteredProducts = filteredProducts.filter(product =>
      product.name?.toLowerCase().includes(searchLower) ||
      product.description?.toLowerCase().includes(searchLower) ||
      product.category?.toLowerCase().includes(searchLower)
    );
  }

  // Filter by categories (including subcategories)
  if (categories.length > 0) {
    filteredProducts = filteredProducts.filter(product => {
      if (!product.category) return false;

      // Check if product category is in any of the selected category hierarchies
      return categories.some(selectedCategory => {
        const categorySlugs = categorySlugMap.get(selectedCategory) || [selectedCategory];
        return categorySlugs.includes(product.category);
      });
    });
  }

  // Filter by tags
  if (tags.length > 0) {
    filteredProducts = filteredProducts.filter(product =>
      product.tags && Array.isArray(product.tags) &&
      tags.some(tag => product.tags.map((t: string) => t.toLowerCase()).includes(tag.toLowerCase()))
    );
  }

  // Filter by finishes
  if (finishes.length > 0) {
    filteredProducts = filteredProducts.filter(product => {
      // Check base product finish
      if (product.finish && finishes.includes(product.finish)) return true;

      // Check variant finishes
      if (product.variants && product.variants.length > 0) {
        return product.variants.some((variant: any) =>
          variant.finish && finishes.includes(variant.finish)
        );
      }

      return false;
    });
  }

  // Filter by colors
  if (colors.length > 0) {
    filteredProducts = filteredProducts.filter(product => {
      // Check base product color
      if (product.color && colors.includes(product.color)) return true;

      // Check variant colors
      if (product.variants && product.variants.length > 0) {
        return product.variants.some((variant: any) =>
          variant.color && colors.includes(variant.color)
        );
      }

      return false;
    });
  }

  // Filter by room types (stored in tags)
  if (roomTypes.length > 0) {
    filteredProducts = filteredProducts.filter(product =>
      product.tags && Array.isArray(product.tags) &&
      roomTypes.some(rt => product.tags.map((t: string) => t.toLowerCase()).includes(rt.toLowerCase()))
    );
  }

  // Filter by sizes
  if (sizes.length > 0) {
    filteredProducts = filteredProducts.filter(product => {
      // Check variants for sizes
      if (product.variants && product.variants.length > 0) {
        return product.variants.some((variant: any) => {
          if (variant.size && sizes.includes(variant.size)) return true;
          if (variant.sizes && Array.isArray(variant.sizes)) {
            return variant.sizes.some((s: string) => sizes.includes(s));
          }
          return false;
        });
      }
      return false;
    });
  }

  // Filter by price range
  if (minPrice !== undefined || maxPrice !== undefined) {
    filteredProducts = filteredProducts.filter(product => {
      const price = product.price || 0;
      if (minPrice !== undefined && price < minPrice) return false;
      if (maxPrice !== undefined && price > maxPrice) return false;
      return true;
    });
  }

  // Calculate pagination
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

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

          {/* Product Grid with Client-Side Filtered Products */}
          <ProductGrid
            products={paginatedProducts}
            totalProducts={totalProducts}
            totalPages={totalPages}
            currentPage={page}
            searchQuery={q}
          />
        </div>
      </div>
    </div>
  );
};

export default Search;
