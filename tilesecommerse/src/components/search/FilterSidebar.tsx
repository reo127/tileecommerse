"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import type { ProductWithVariants } from "@/schemas";
import { useCategories } from "@/hooks/category";

interface FilterSidebarProps {
  allProducts: ProductWithVariants[];
  selectedCategories: string[];
  selectedTags: string[];
  selectedFinishes: string[];
  selectedColors: string[];
  selectedRoomTypes: string[];
  selectedSizes: string[];
  minPrice?: number;
  maxPrice?: number;
}

export const FilterSidebar = ({
  allProducts,
  selectedCategories,
  selectedTags,
  selectedFinishes,
  selectedColors,
  selectedRoomTypes,
  selectedSizes,
  minPrice: initialMinPrice,
  maxPrice: initialMaxPrice,
}: FilterSidebarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Fetch main categories from API (same as navbar)
  const { categories: dbCategories } = useCategories(false); // Only active categories

  const [openSections, setOpenSections] = useState<string[]>([
    "Categories",
    "Tags",
    "Room Type",
    "Finish Type",
    "Color",
  ]);
  const [priceRange, setPriceRange] = useState({
    min: initialMinPrice?.toString() || "",
    max: initialMaxPrice?.toString() || "",
  });

  // Generate filter options dynamically from products
  const filterOptions = useMemo(() => {
    const finishes = new Map<string, number>();
    const colors = new Map<string, number>();
    const roomTypes = new Map<string, number>();
    const sizes = new Map<string, number>();
    const tags = new Map<string, number>();

    // Predefined tags
    const predefinedTags = ['popular', 'trending', 'new', 'premium', 'exclusive', 'classic', 'bestseller', 'limited'];

    // Helper function to get all descendant category slugs (including the parent)
    const getAllCategorySlugs = (category: any): string[] => {
      const slugs = [category.slug];
      if (category.children && category.children.length > 0) {
        category.children.forEach((child: any) => {
          slugs.push(...getAllCategorySlugs(child));
        });
      }
      return slugs;
    };

    // Build a map of main category slug -> all related slugs (including subcategories)
    const categorySlugMap = new Map<string, string[]>();
    dbCategories.forEach(category => {
      const allSlugs = getAllCategorySlugs(category);
      categorySlugMap.set(category.slug, allSlugs);
    });

    // Count products for each main category (including subcategories)
    const categoryCounts = new Map<string, number>();

    allProducts.forEach(product => {
      const productCategorySlug = product.category || '';

      // Check which main category this product belongs to
      if (productCategorySlug) {
        categorySlugMap.forEach((slugs, mainCategorySlug) => {
          if (slugs.includes(productCategorySlug)) {
            categoryCounts.set(mainCategorySlug, (categoryCounts.get(mainCategorySlug) || 0) + 1);
          }
        });
      }

      // Count tags
      if (product.tags && Array.isArray(product.tags)) {
        product.tags.forEach((tag: string) => {
          if (predefinedTags.includes(tag.toLowerCase())) {
            tags.set(tag.toLowerCase(), (tags.get(tag.toLowerCase()) || 0) + 1);
          }
        });
      }

      // Count finishes from base product
      if (product.finish) {
        finishes.set(product.finish, (finishes.get(product.finish) || 0) + 1);
      }

      // Count colors from base product
      if (product.color) {
        colors.set(product.color, (colors.get(product.color) || 0) + 1);
      }

      // Extract finishes, colors, and sizes from variants
      if (product.variants && product.variants.length > 0) {
        product.variants.forEach((variant: any) => {
          // Variant finishes
          if (variant.finish) {
            finishes.set(variant.finish, (finishes.get(variant.finish) || 0) + 1);
          }

          // Variant colors
          if (variant.color) {
            colors.set(variant.color, (colors.get(variant.color) || 0) + 1);
          }

          // Variant sizes
          if (variant.size) {
            sizes.set(variant.size, (sizes.get(variant.size) || 0) + 1);
          }
          if (variant.sizes && Array.isArray(variant.sizes)) {
            variant.sizes.forEach((size: string) => {
              if (size) {
                sizes.set(size, (sizes.get(size) || 0) + 1);
              }
            });
          }
        });
      }

      // Count room types
      if (product.roomType) {
        product.roomType.forEach((rt: string) => {
          roomTypes.set(rt, (roomTypes.get(rt) || 0) + 1);
        });
      }
    });

    // Ensure all predefined tags are in the list (even with 0 count)
    predefinedTags.forEach(tag => {
      if (!tags.has(tag)) {
        tags.set(tag, 0);
      }
    });

    // Use categories from API and add product counts (including subcategories)
    const categoriesWithCounts = dbCategories.map(category => ({
      label: category.name,
      value: category.slug,
      count: categoryCounts.get(category.slug) || 0,
    }));

    return {
      categories: categoriesWithCounts,
      tags: Array.from(tags.entries()).map(([value, count]) => ({
        label: value.charAt(0).toUpperCase() + value.slice(1),
        value,
        count,
      })),
      finishes: Array.from(finishes.entries()).map(([value, count]) => ({
        label: value.charAt(0).toUpperCase() + value.slice(1),
        value,
        count,
      })),
      colors: Array.from(colors.entries()).map(([value, count]) => ({
        label: value.charAt(0).toUpperCase() + value.slice(1),
        value,
        count,
      })),
      roomTypes: Array.from(roomTypes.entries()).map(([value, count]) => ({
        label: value.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        value,
        count,
      })),
      sizes: Array.from(sizes.entries()).map(([value, count]) => ({
        label: value,
        value,
        count,
      })),
    };
  }, [allProducts, dbCategories]);

  const toggleSection = (title: string) => {
    setOpenSections((prev) =>
      prev.includes(title)
        ? prev.filter((section) => section !== title)
        : [...prev, title]
    );
  };

  const updateFilters = (filterType: string, value: string, checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString());

    // Get current values for this filter type
    const currentValues = params.getAll(filterType);

    if (checked) {
      // Add the value
      params.append(filterType, value);
    } else {
      // Remove the value
      params.delete(filterType);
      currentValues
        .filter(v => v !== value)
        .forEach(v => params.append(filterType, v));
    }

    router.push(`/search?${params.toString()}`);
  };

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (priceRange.min) {
      params.set('minPrice', priceRange.min);
    } else {
      params.delete('minPrice');
    }

    if (priceRange.max) {
      params.set('maxPrice', priceRange.max);
    } else {
      params.delete('maxPrice');
    }

    router.push(`/search?${params.toString()}`);
  };

  const clearAllFilters = () => {
    setPriceRange({ min: "", max: "" });
    router.push('/search');
  };

  return (
    <aside className="w-full lg:w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">Filters</h2>
          <button
            onClick={clearAllFilters}
            className="text-sm text-orange-500 hover:text-orange-600 font-medium"
          >
            Clear All
          </button>
        </div>

        {/* Price Range */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <button
            onClick={() => toggleSection("Price Range")}
            className="flex items-center justify-between w-full mb-3"
          >
            <h3 className="font-semibold text-slate-800">Price Range</h3>
            {openSections.includes("Price Range") ? (
              <FaChevronUp className="text-slate-600 text-sm" />
            ) : (
              <FaChevronDown className="text-slate-600 text-sm" />
            )}
          </button>
          {openSections.includes("Price Range") && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <button
                onClick={applyPriceFilter}
                className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
              >
                Apply
              </button>
            </div>
          )}
        </div>

        {/* Categories Filter */}
        {filterOptions.categories.length > 0 && (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <button
              onClick={() => toggleSection("Categories")}
              className="flex items-center justify-between w-full mb-3"
            >
              <h3 className="font-semibold text-slate-800">Categories</h3>
              {openSections.includes("Categories") ? (
                <FaChevronUp className="text-slate-600 text-sm" />
              ) : (
                <FaChevronDown className="text-slate-600 text-sm" />
              )}
            </button>
            {openSections.includes("Categories") && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filterOptions.categories.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(option.value)}
                        onChange={(e) => updateFilters('category', option.value, e.target.checked)}
                        className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
                      />
                      <span className="text-sm text-slate-700 group-hover:text-orange-500">
                        {option.label}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">({option.count})</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tags Filter */}
        {filterOptions.tags.length > 0 && (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <button
              onClick={() => toggleSection("Tags")}
              className="flex items-center justify-between w-full mb-3"
            >
              <h3 className="font-semibold text-slate-800">Tags</h3>
              {openSections.includes("Tags") ? (
                <FaChevronUp className="text-slate-600 text-sm" />
              ) : (
                <FaChevronDown className="text-slate-600 text-sm" />
              )}
            </button>
            {openSections.includes("Tags") && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filterOptions.tags.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(option.value)}
                        onChange={(e) => updateFilters('tags', option.value, e.target.checked)}
                        className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
                      />
                      <span className="text-sm text-slate-700 group-hover:text-orange-500">
                        {option.label}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">({option.count})</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Finish Filter */}
        {filterOptions.finishes.length > 0 && (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <button
              onClick={() => toggleSection("Finish Type")}
              className="flex items-center justify-between w-full mb-3"
            >
              <h3 className="font-semibold text-slate-800">Finish Type</h3>
              {openSections.includes("Finish Type") ? (
                <FaChevronUp className="text-slate-600 text-sm" />
              ) : (
                <FaChevronDown className="text-slate-600 text-sm" />
              )}
            </button>
            {openSections.includes("Finish Type") && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filterOptions.finishes.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedFinishes.includes(option.value)}
                        onChange={(e) => updateFilters('finish', option.value, e.target.checked)}
                        className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
                      />
                      <span className="text-sm text-slate-700 group-hover:text-orange-500">
                        {option.label}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">({option.count})</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Color Filter */}
        {filterOptions.colors.length > 0 && (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <button
              onClick={() => toggleSection("Color")}
              className="flex items-center justify-between w-full mb-3"
            >
              <h3 className="font-semibold text-slate-800">Color</h3>
              {openSections.includes("Color") ? (
                <FaChevronUp className="text-slate-600 text-sm" />
              ) : (
                <FaChevronDown className="text-slate-600 text-sm" />
              )}
            </button>
            {openSections.includes("Color") && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filterOptions.colors.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedColors.includes(option.value)}
                        onChange={(e) => updateFilters('color', option.value, e.target.checked)}
                        className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
                      />
                      <span className="text-sm text-slate-700 group-hover:text-orange-500">
                        {option.label}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">({option.count})</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Room Type Filter */}
        {filterOptions.roomTypes.length > 0 && (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <button
              onClick={() => toggleSection("Room Type")}
              className="flex items-center justify-between w-full mb-3"
            >
              <h3 className="font-semibold text-slate-800">Room Type</h3>
              {openSections.includes("Room Type") ? (
                <FaChevronUp className="text-slate-600 text-sm" />
              ) : (
                <FaChevronDown className="text-slate-600 text-sm" />
              )}
            </button>
            {openSections.includes("Room Type") && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filterOptions.roomTypes.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedRoomTypes.includes(option.value)}
                        onChange={(e) => updateFilters('roomType', option.value, e.target.checked)}
                        className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
                      />
                      <span className="text-sm text-slate-700 group-hover:text-orange-500">
                        {option.label}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">({option.count})</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Size Filter */}
        {filterOptions.sizes.length > 0 && (
          <div className="mb-6">
            <button
              onClick={() => toggleSection("Size")}
              className="flex items-center justify-between w-full mb-3"
            >
              <h3 className="font-semibold text-slate-800">Size</h3>
              {openSections.includes("Size") ? (
                <FaChevronUp className="text-slate-600 text-sm" />
              ) : (
                <FaChevronDown className="text-slate-600 text-sm" />
              )}
            </button>
            {openSections.includes("Size") && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filterOptions.sizes.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedSizes.includes(option.value)}
                        onChange={(e) => updateFilters('size', option.value, e.target.checked)}
                        className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
                      />
                      <span className="text-sm text-slate-700 group-hover:text-orange-500">
                        {option.label}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">({option.count})</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </aside>
  );
};
