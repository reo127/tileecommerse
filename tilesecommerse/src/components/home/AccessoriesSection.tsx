"use client";

import Link from "next/link";
import Image from "next/image";

const accessories = [
  {
    id: 1,
    name: "Tile Adhesive & Grout",
    description: "Premium quality adhesive for perfect installation",
    image: "/product photos/Tile Adhesive & Grout.png",
    price: "₹450/bag",
    stock: "In Stock",
    href: "/ceramic",
  },
  {
    id: 2,
    name: "Tile Spacers Set",
    description: "Professional spacers for uniform joints",
    image: "/product photos/Tile Spacers Set.jpg",
    price: "₹120/pack",
    stock: "In Stock",
    href: "/ceramic",
  },
  {
    id: 3,
    name: "Tile Cutting Tools",
    description: "Precision cutting for perfect edges",
    image: "/product photos/Tile Cutting Tools.jpg",
    price: "₹2,500",
    stock: "Low Stock",
    href: "/ceramic",
  },
  {
    id: 4,
    name: "Grout Sealer",
    description: "Waterproof protection for tile joints",
    image: "/product photos/Grout Sealer.png",
    price: "₹350/bottle",
    stock: "In Stock",
    href: "/ceramic",
  },
  {
    id: 5,
    name: "Tile Leveling System",
    description: "Achieve perfectly leveled tile surface",
    image: "/product photos/Tile Leveling System.webp",
    price: "₹850/set",
    stock: "In Stock",
    href: "/ceramic",
  },
  {
    id: 6,
    name: "Tile Cleaning Solution",
    description: "Keep your tiles sparkling clean",
    image: "/product photos/Tile Cleaning Solution.webp",
    price: "₹280/liter",
    stock: "In Stock",
    href: "/ceramic",
  },
];

const AccessoryCard = ({ accessory }: { accessory: typeof accessories[0] }) => {
  return (
    <Link
      href={accessory.href}
      className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden bg-gray-100">
        <Image
          src={accessory.image}
          alt={accessory.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Add to Cart overlay on hover */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="px-3 py-1.5 bg-yellow-500 text-white text-sm font-semibold rounded-lg hover:bg-yellow-600 transition-colors shadow-lg">
            Add to Cart
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <h3 className="font-bold text-slate-900 mb-1 group-hover:text-yellow-500 transition-colors">
            {accessory.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {accessory.description}
          </p>
          <span className={`text-xs font-semibold ${accessory.stock === "In Stock" ? "text-green-600" : "text-yellow-600"}`}>
            {accessory.stock}
          </span>
        </div>
        <p className="text-xl font-bold text-yellow-600 mt-2">
          {accessory.price}
        </p>
      </div>
    </Link>
  );
};

export const AccessoriesSection = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
      {/* Header */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
            Accessories
          </h2>
          <p className="text-slate-600 text-lg">
            Everything you need for perfect tile installation
          </p>
        </div>
        <Link
          href="/search"
          className="hidden md:block text-yellow-500 hover:text-yellow-600 font-semibold transition-colors"
        >
          View All →
        </Link>
      </div>

      {/* Accessories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {accessories.map((accessory) => (
          <AccessoryCard key={accessory.id} accessory={accessory} />
        ))}
      </div>

      {/* View All Mobile */}
      <div className="mt-8 text-center md:hidden">
        <Link
          href="/search"
          className="inline-block px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          View All Accessories
        </Link>
      </div>
    </section>
  );
};
