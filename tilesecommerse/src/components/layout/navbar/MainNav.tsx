"use client";

import { useState } from "react";
import Link from "next/link";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { useCategories } from "@/hooks/category";

export const MainNav = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeSubDropdown, setActiveSubDropdown] = useState<string | null>(null);
  const { categories: dbCategories, isLoading } = useCategories(false); // Only active categories

  // Transform database categories to navbar format with 3 levels
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
        // Add sub-subcategories (level 2)
        children: (child.children || []).map((subChild: any) => ({
          name: subChild.name,
          href: `/search?category=${category.slug}&subcategory=${child.slug}&subsubcategory=${subChild.slug}`,
          slug: subChild.slug,
        })),
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
                onMouseLeave={() => {
                  setActiveDropdown(null);
                  setActiveSubDropdown(null);
                }}
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

                {/* First Level Dropdown (Subcategories) */}
                {category.subcategories.length > 0 && activeDropdown === category.name && (
                  <div className="absolute left-0 top-full bg-white text-slate-800 shadow-2xl rounded-b-lg min-w-[240px] border border-gray-200" style={{ zIndex: 9999 }}>
                    <ul className="py-2 max-h-[500px] overflow-y-auto overflow-x-visible">
                      {category.subcategories.map((sub) => (
                        <li
                          key={sub.name}
                          className="relative"
                          onMouseEnter={() => {
                            if (sub.children && sub.children.length > 0) {
                              setActiveSubDropdown(sub.slug);
                            }
                          }}
                          onMouseLeave={(e) => {
                            // Only clear if not moving to the nested dropdown
                            const relatedTarget = e.relatedTarget as HTMLElement;
                            if (!relatedTarget?.closest('[data-nested-dropdown]')) {
                              setActiveSubDropdown(null);
                            }
                          }}
                        >
                          {/* Subcategory (Level 1) */}
                          <Link
                            href={sub.href}
                            className="flex items-center justify-between px-4 py-2 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                          >
                            <span>{sub.name}</span>
                            {sub.children && sub.children.length > 0 && (
                              <FaChevronRight className="text-xs text-slate-400" />
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>

                    {/* Second Level Dropdown (Sub-subcategories) - Rendered outside UL */}
                    {category.subcategories.map((sub) => (
                      sub.children && sub.children.length > 0 && activeSubDropdown === sub.slug && (
                        <div
                          key={`nested-${sub.slug}`}
                          data-nested-dropdown
                          className="absolute left-full top-0 bg-white text-slate-800 shadow-2xl rounded-lg min-w-[240px] max-h-[500px] overflow-y-auto border border-gray-200"
                          style={{
                            zIndex: 10000,
                            marginTop: `${category.subcategories.findIndex(s => s.slug === sub.slug) * 40 + 8}px`
                          }}
                          onMouseEnter={() => setActiveSubDropdown(sub.slug)}
                          onMouseLeave={() => setActiveSubDropdown(null)}
                        >
                          <ul className="py-2">
                            {sub.children.map((subSub: any) => (
                              <li key={subSub.name}>
                                <Link
                                  href={subSub.href}
                                  className="block px-4 py-2 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                                >
                                  {subSub.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    ))}
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
