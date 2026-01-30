"use client";

import { useState } from "react";
import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";
import { useCategories } from "@/hooks/category";

export const MainNav = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { categories: dbCategories, isLoading } = useCategories(false); // Only active categories

  // Transform database categories to navbar format
  const categories = [
    {
      name: "All Products",
      href: "/search",
      slug: "all",
      subcategories: [],
    },
    ...dbCategories.map((category) => ({
      name: category.name,
      href: `/search?category=${category.slug}`,
      slug: category.slug,
      subcategories: (category.children || []).map((child: any) => ({
        name: child.name,
        href: `/search?category=${category.slug}&subcategory=${child.slug}`,
        slug: child.slug,
      })),
    })),
  ];

  return (
    <nav className="text-white bg-gradient-to-r from-slate-800 via-slate-700 to-gray-800 border-t border-slate-600/50 shadow-lg">
      <div className="max-w-7xl mx-auto">
        {/* Multi-line Categories */}
        <div>
          <ul className="flex items-center flex-wrap">
            {categories.map((category) => (
              <li
                key={category.name}
                className="relative group"
                onMouseEnter={() =>
                  category.subcategories.length > 0 && setActiveDropdown(category.name)
                }
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={category.href}
                  className="flex items-center gap-1 px-4 py-2 hover:bg-gradient-to-r hover:from-orange-600 hover:to-orange-500 transition-all duration-300 text-sm rounded-md"
                >
                  <span className="whitespace-nowrap">{category.name}</span>
                  {category.subcategories.length > 0 && (
                    <FaChevronDown className="text-xs flex-shrink-0" />
                  )}
                </Link>

                {/* Dropdown */}
                {category.subcategories.length > 0 && activeDropdown === category.name && (
                  <div className="absolute left-0 top-full bg-white text-slate-800 shadow-2xl rounded-b-lg min-w-[240px] max-h-[400px] overflow-y-auto border border-gray-200" style={{ zIndex: 9999 }}>
                    <ul className="py-2">
                      {category.subcategories.map((sub) => (
                        <li key={sub.name}>
                          <Link
                            href={sub.href}
                            className="block px-4 py-2 hover:bg-orange-50 hover:text-orange-600 transition-colors whitespace-nowrap"
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};
