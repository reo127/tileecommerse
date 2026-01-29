"use client";

import { useState } from "react";
import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";

const categories = [
  {
    name: "All Products",
    href: "/search",
    subcategories: [],
  },
  {
    name: "Tiles",
    href: "/search?category=tiles",
    subcategories: [
      { name: "Simple", href: "/search?category=tiles&type=simple" },
      { name: "Full Body", href: "/search?category=tiles&type=full-body" },
      { name: "Heavy", href: "/search?category=tiles&type=heavy" },
      { name: "Anti-Skid", href: "/search?category=tiles&type=anti-skid" },
      { name: "Wood", href: "/search?category=tiles&type=wood" },
      { name: "Motif", href: "/search?category=tiles&type=motif" },
      { name: "60×30", href: "/search?category=tiles&size=60x30" },
      { name: "Kajaria", href: "/search?category=tiles&brand=kajaria" },
      { name: "Imported", href: "/search?category=tiles&type=imported" },
    ],
  },
  {
    name: "Sanitary & CP Fittings",
    href: "/search?category=sanitary",
    subcategories: [
      { name: "CP Fittings - Grohe", href: "/search?category=cp-fittings&brand=grohe" },
      { name: "CP Fittings - American Standard", href: "/search?category=cp-fittings&brand=american-standard" },
      { name: "CP Fittings - Jaquar ESSCO", href: "/search?category=cp-fittings&brand=jaquar-essco" },
      { name: "CP Fittings - CERA", href: "/search?category=cp-fittings&brand=cera" },
      { name: "CP Fittings - Hindware", href: "/search?category=cp-fittings&brand=hindware" },
      { name: "CP Fittings - Parryware", href: "/search?category=cp-fittings&brand=parryware" },
      { name: "CP Fittings - Bell", href: "/search?category=cp-fittings&brand=bell" },
      { name: "CP Fittings - Simpolo", href: "/search?category=cp-fittings&brand=simpolo" },
      { name: "Sanitary Ware - Jaquar", href: "/search?category=sanitary-ware&brand=jaquar" },
      { name: "Sanitary Ware - Parryware", href: "/search?category=sanitary-ware&brand=parryware" },
      { name: "Sanitary Ware - ESSCO", href: "/search?category=sanitary-ware&brand=essco" },
      { name: "Sanitary Ware - CERA", href: "/search?category=sanitary-ware&brand=cera" },
      { name: "Sanitary Ware - Glocera", href: "/search?category=sanitary-ware&brand=glocera" },
    ],
  },
  {
    name: "Chimney",
    href: "/search?category=chimney",
    subcategories: [
      { name: "KAFF", href: "/search?category=chimney&brand=kaff" },
      { name: "FABER", href: "/search?category=chimney&brand=faber" },
      { name: "Elica", href: "/search?category=chimney&brand=elica" },
      { name: "Crompton", href: "/search?category=chimney&brand=crompton" },
      { name: "Hindware", href: "/search?category=chimney&brand=hindware" },
    ],
  },
  {
    name: "Hob & Gas Stove",
    href: "/search?category=hob-gas-stove",
    subcategories: [
      { name: "Prestige", href: "/search?category=hob-gas-stove&brand=prestige" },
      { name: "Faber", href: "/search?category=hob-gas-stove&brand=faber" },
      { name: "Pigeon", href: "/search?category=hob-gas-stove&brand=pigeon" },
      { name: "Glen", href: "/search?category=hob-gas-stove&brand=glen" },
      { name: "Butterfly", href: "/search?category=hob-gas-stove&brand=butterfly" },
      { name: "Kaff", href: "/search?category=hob-gas-stove&brand=kaff" },
      { name: "Sunflame", href: "/search?category=hob-gas-stove&brand=sunflame" },
    ],
  },
  {
    name: "Adhesive & Cement",
    href: "/search?category=adhesive-cement",
    subcategories: [
      { name: "ACC", href: "/search?category=adhesive-cement&brand=acc" },
      { name: "Birla Super", href: "/search?category=adhesive-cement&brand=birla-super" },
      { name: "Ultratech", href: "/search?category=adhesive-cement&brand=ultratech" },
      { name: "Maha", href: "/search?category=adhesive-cement&brand=maha" },
      { name: "Roff", href: "/search?category=adhesive-cement&brand=roff" },
      { name: "Myk", href: "/search?category=adhesive-cement&brand=myk" },
      { name: "Asian Paints", href: "/search?category=adhesive-cement&brand=asian-paints" },
      { name: "Dr. Fixit", href: "/search?category=adhesive-cement&brand=dr-fixit" },
    ],
  },
  {
    name: "Plumbing",
    href: "/search?category=plumbing",
    subcategories: [
      { name: "Ashirvad", href: "/search?category=plumbing&brand=ashirvad" },
      { name: "Astral", href: "/search?category=plumbing&brand=astral" },
      { name: "Finolex", href: "/search?category=plumbing&brand=finolex" },
      { name: "Supreme", href: "/search?category=plumbing&brand=supreme" },
      { name: "Aladdin", href: "/search?category=plumbing&brand=aladdin" },
      { name: "Vectus", href: "/search?category=plumbing&brand=vectus" },
      { name: "Sintex", href: "/search?category=plumbing&brand=sintex" },
    ],
  },
  {
    name: "Pumps & Motors",
    href: "/search?category=pumps-motors",
    subcategories: [
      { name: "Kirloskar", href: "/search?category=pumps-motors&brand=kirloskar" },
      { name: "Texmo", href: "/search?category=pumps-motors&brand=texmo" },
      { name: "KSB", href: "/search?category=pumps-motors&brand=ksb" },
      { name: "Crompton", href: "/search?category=pumps-motors&brand=crompton" },
    ],
  },
  {
    name: "Accessories",
    href: "/search?category=accessories",
    subcategories: [
      { name: "Bathroom Accessories", href: "/search?category=accessories&type=bathroom" },
      { name: "Kitchen Accessories", href: "/search?category=accessories&type=kitchen" },
    ],
  },
  {
    name: "Sink",
    href: "/search?category=sink",
    subcategories: [
      { name: "Franke", href: "/search?category=sink&brand=franke" },
      { name: "Futuro", href: "/search?category=sink&brand=futuro" },
      { name: "Carysil", href: "/search?category=sink&brand=carysil" },
      { name: "Imported", href: "/search?category=sink&type=imported" },
    ],
  },
  {
    name: "SPA & Wellness",
    href: "/search?category=spa-wellness",
    subcategories: [
      { name: "Shower Partition", href: "/search?category=spa-wellness&type=shower-partition" },
      { name: "Bath Tubs", href: "/search?category=spa-wellness&type=bath-tubs" },
    ],
  },
  {
    name: "Locker",
    href: "/search?category=locker",
    subcategories: [
      { name: "Godrej", href: "/search?category=locker&brand=shower-partition" },
    ],
  },
  {
    name: "Gysers",
    href: "/search?category=gysers",
    subcategories: [
      { name: "A-One", href: "/search?category=gysers&brand=a-one" },
      { name: "ESSCO", href: "/search?category=gysers&brand=essco" },
      { name: "V-Guard", href: "/search?category=gysers&brand=v-guard" },
      { name: "Crompton", href: "/search?category=gysers&brand=crompton" },
    ],
  },
];

export const MainNav = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <nav className="text-white border-t" style={{ backgroundColor: '#7C0A02', borderTopColor: '#5A0701' }}>
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
                  className="flex items-center gap-1 px-4 py-2 transition-colors text-sm"
                  style={{ ['&:hover' as any]: { backgroundColor: '#5A0701' } }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5A0701'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
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
