"use client";

import type { ProductWithVariants } from "@/schemas";
import { ProductItem } from "@/components/products";
import { useState, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { FaTh, FaBars } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface ProductGridProps {
  products: ProductWithVariants[];
  totalProducts: number;
  totalPages: number;
  currentPage: number;
  searchQuery?: string;
}

export const ProductGrid = ({
  products,
  totalProducts,
  totalPages,
  currentPage,
  searchQuery
}: ProductGridProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("featured");

  // Get current limit from URL or default to 12
  const itemsPerPage = parseInt(searchParams.get('limit') || '12');

  const sortOptions = [
    { label: "Featured", value: "featured" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Newest First", value: "newest" },
    { label: "Best Rating", value: "rating" },
  ];

  const itemsPerPageOptions = [3, 6, 12, 18, 24, 30];

  // Sort products (client-side sorting for current page)
  const sortedProducts = useMemo(() => {
    const productsCopy = [...products];

    switch (sortBy) {
      case "price-asc":
        return productsCopy.sort((a, b) => a.price - b.price);
      case "price-desc":
        return productsCopy.sort((a, b) => b.price - a.price);
      case "newest":
        return productsCopy.reverse();
      case "rating":
        return productsCopy.sort((a, b) => (b.ratings || 0) - (a.ratings || 0));
      case "featured":
      default:
        return productsCopy;
    }
  }, [products, sortBy]);

  // Update URL params helper
  const updateURLParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      params.set(key, value);
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    updateURLParams({ page: newPage.toString() });
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value: number) => {
    updateURLParams({
      limit: value.toString(),
      page: '1' // Reset to page 1 when changing items per page
    });
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + products.length;

  return (
    <div className="flex-1">
      {/* Header with Results Count and Sort */}
      <div className="flex flex-col gap-4 mb-6">
        {/* Title and Count */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {searchQuery ? `Search Results for "${searchQuery}"` : "All Tiles"}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {totalProducts > 0 ? (
              <>
                Showing {startIndex + 1}-{endIndex} of {totalProducts} {totalProducts === 1 ? "product" : "products"}
              </>
            ) : (
              "No products found"
            )}
          </p>
        </div>

        {/* Controls Row: Items Per Page, Sort, View Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Items Per Page Selector - Always Visible */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 font-medium whitespace-nowrap">Show:</span>
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-1">
              {itemsPerPageOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleItemsPerPageChange(option)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${itemsPerPage === option
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                    }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <span className="text-sm text-slate-600 whitespace-nowrap">per page</span>
          </div>

          {/* Right Side: Sort and View Toggle */}
          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-slate-600 whitespace-nowrap">
                Sort by:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* View Toggle */}
            <div className="hidden sm:flex items-center gap-1 border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${viewMode === "grid"
                  ? "bg-orange-500 text-white"
                  : "text-slate-600 hover:bg-gray-100"
                  }`}
                title="Grid View"
              >
                <FaTh size={14} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${viewMode === "list"
                  ? "bg-orange-500 text-white"
                  : "text-slate-600 hover:bg-gray-100"
                  }`}
                title="List View"
              >
                <FaBars size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      {sortedProducts.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "flex flex-col gap-4"
          }
        >
          {sortedProducts.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">No products found</h3>
          <p className="text-slate-600">
            {searchQuery
              ? `Try adjusting your search or filters to find what you're looking for.`
              : "No products available at the moment."}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalProducts > 0 && totalPages > 1 && (
        <div className="mt-12">
          {/* Page Navigation */}
          <div className="flex items-center justify-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
            >
              <FiChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, index) => (
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className="px-2 text-slate-400">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page as number)}
                    className={`min-w-[40px] h-10 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${currentPage === page
                      ? "bg-orange-500 text-white shadow-sm"
                      : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                      }`}
                  >
                    {page}
                  </button>
                )
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
            >
              <span className="hidden sm:inline">Next</span>
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Page Info */}
          <div className="text-center text-sm text-slate-500 mt-4">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      )}
    </div>
  );
};
