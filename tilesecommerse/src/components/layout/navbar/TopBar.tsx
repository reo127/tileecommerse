"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaPhone, FaCalculator, FaStore, FaSearch, FaUser } from "react-icons/fa";
import { useSession } from "@/lib/auth/client";

import { WishlistLink } from "./WishlistLink";
import { CartLink } from "./CartLink";
import type { Manager } from "@/hooks/useManager";

export const TopBar = ({ editProfileManager }: { editProfileManager: Manager }) => {
  const { data: session, isPending } = useSession();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="text-white bg-gradient-to-r from-red-600 via-red-500 to-orange-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left Section: Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <div className="relative w-16 h-16 mr-3 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/logo.png"
                  alt="SLN Tiles Showroom"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">SLN TILES SHOWROOM</h1>
                <p className="text-xs text-white">Premium Quality Tiles</p>
              </div>
            </Link>
          </div>

          {/* Center Section: Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm">
            <Link href="/" className="text-white hover:text-orange-400 transition-colors font-medium">
              Home
            </Link>
            <Link href="/blogs" className="text-white hover:text-orange-400 transition-colors">
              Blog
            </Link>
            <Link href="/Gallery" className="text-white hover:text-orange-400 transition-colors">
              Gallery
            </Link>
          </nav>

          {/* Right Section: Icons and Actions */}
          <div className="flex items-center gap-4">
            {/* Phone */}
            <Link
              href="tel:+919738522119"
              className="hidden xl:flex items-center gap-2 text-white hover:text-orange-400 transition-colors"
            >
              <FaPhone className="text-orange-400" size={16} />
              <span className="text-sm">097385 22119</span>
            </Link>

            {/* Calculator */}
            <Link
              href="/calculator"
              className="hidden lg:flex flex-col items-center justify-center text-white hover:text-orange-400 transition-colors"
              title="Tile Calculator"
            >
              <FaCalculator size={20} />
              <span className="text-xs mt-1">Calculator</span>
            </Link>

            {/* Store */}
            <Link
              href="/store"
              className="hidden lg:flex flex-col items-center justify-center text-white hover:text-orange-400 transition-colors"
              title="Store Locator"
            >
              <FaStore size={20} />
              <span className="text-xs mt-1">Store</span>
            </Link>

            {/* Search */}
            <Link
              href="/search"
              className="flex flex-col items-center justify-center text-white hover:text-orange-400 transition-colors"
              title="Search"
            >
              <FaSearch size={20} />
              <span className="text-xs mt-1 hidden md:block">Search</span>
            </Link>

            {/* Sign In / User */}
            {!mounted || isPending ? (
              <div className="w-12 h-12 bg-gray-700 rounded-full animate-pulse" />
            ) : session?.user ? (
              <button
                onClick={editProfileManager.open}
                className="flex flex-col items-center justify-center text-white hover:text-orange-400 transition-colors"
              >
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <FaUser size={14} />
                </div>
                <span className="text-xs mt-1 hidden md:block">Account</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="flex flex-col items-center justify-center text-white hover:text-orange-400 transition-colors"
              >
                <FaUser size={20} />
                <span className="text-xs mt-1 hidden md:block">Sign In</span>
              </Link>
            )}

            {/* Wishlist */}
            <div className="flex flex-col items-center justify-center">
              <WishlistLink />
              <span className="text-xs mt-1 hidden md:block text-white">Wishlist</span>
            </div>

            {/* Cart */}
            <div className="flex flex-col items-center justify-center">
              <CartLink />
              <span className="text-xs mt-1 hidden md:block text-white">Cart</span>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};
