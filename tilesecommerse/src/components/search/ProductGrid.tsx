"use client";

import type { ProductWithVariants } from "@/schemas";
import { ProductItem } from "@/components/products";
import { useState, useMemo } from "react";
import { FaTh, FaBars } from "react-icons/fa";

interface ProductGridProps {
  products: ProductWithVariants[];
  searchQuery?: string;
}

export const ProductGrid = ({ products, searchQuery }: ProductGridProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("featured");

  const sortOptions = [
    { label: "Featured", value: "featured" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Newest First", value: "newest" },
    { label: "Best Rating", value: "rating" },
  ];

  // Sort products based on selected sort option
  const sortedProducts = useMemo(() => {
    const productsCopy = [...products];

    switch (sortBy) {
      case "price-asc":
        return productsCopy.sort((a, b) => a.price - b.price);
      case "price-desc":
        return productsCopy.sort((a, b) => b.price - a.price);
      case "newest":
        // Assuming products are already sorted by creation date from backend
        return productsCopy.reverse();
      case "rating":
        return productsCopy.sort((a, b) => (b.ratings || 0) - (a.ratings || 0));
      case "featured":
      default:
        return productsCopy;
    }
  }, [products, sortBy]);

  return (
    <div className="flex-1">
      {/* Header with Results Count and Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {searchQuery ? `Search Results for "${searchQuery}"` : "All Tiles"}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Showing {sortedProducts.length} {sortedProducts.length === 1 ? "product" : "products"}
          </p>
        </div>

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
              className={`p-2 rounded ${
                viewMode === "grid"
                  ? "bg-orange-500 text-white"
                  : "text-slate-600 hover:bg-gray-100"
              }`}
              title="Grid View"
            >
              <FaTh size={14} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded ${
                viewMode === "list"
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
      {sortedProducts.length > 0 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Previous
          </button>
          <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium">
            1
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-gray-50">
            2
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-gray-50">
            3
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-gray-50">
            Next
          </button>
        </div>
      )}
    </div>
  );
};
