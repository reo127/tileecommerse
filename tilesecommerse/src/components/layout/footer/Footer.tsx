"use client";

import Link from "next/link";
import Image from "next/image";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

export const Footer = () => {
  const linkStyles = "text-sm text-white transition duration-150 ease hover:text-orange-400";
  const liStyles = "text-white my-2";

  return (
    <footer className="text-white mt-20 bg-gradient-to-r from-slate-900 via-slate-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            {/* Logo */}
            <div className="mb-4">
              <Image
                src="/logo.png"
                alt="SLN Tiles Showroom Logo"
                width={128}
                height={128}
                className="rounded-lg shadow-lg"
              />
            </div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">SLN TILES SHOWROOM</h3>
            <p className="text-white text-sm mb-4">
              Your trusted partner for premium quality tiles in Bengaluru. Transforming spaces with innovative designs and exceptional service.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Products</h3>
            <ul>
              <li className={liStyles}>
                <Link href="/ceramic" className={linkStyles}>
                  Ceramic Tiles
                </Link>
              </li>
              <li className={liStyles}>
                <Link href="/porcelain" className={linkStyles}>
                  Vitrified Tiles
                </Link>
              </li>
              <li className={liStyles}>
                <Link href="/marble" className={linkStyles}>
                  Marble Finish
                </Link>
              </li>
              <li className={liStyles}>
                <Link href="/ceramic" className={linkStyles}>
                  Bathroom Tiles
                </Link>
              </li>
              <li className={liStyles}>
                <Link href="/ceramic" className={linkStyles}>
                  Kitchen Tiles
                </Link>
              </li>
              <li className={liStyles}>
                <Link href="/porcelain" className={linkStyles}>
                  Floor Tiles
                </Link>
              </li>
              <li className={liStyles}>
                <Link href="/ceramic" className={linkStyles}>
                  Wall Tiles
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Quick Links</h3>
            <ul>
              <li className={liStyles}>
                <Link href="/" className={linkStyles}>
                  Home
                </Link>
              </li>
              <li className={liStyles}>
                <Link href="/search" className={linkStyles}>
                  Search Products
                </Link>
              </li>
              <li className={liStyles}>
                <Link href="/cart" className={linkStyles}>
                  Shopping Cart
                </Link>
              </li>
              <li className={liStyles}>
                <Link href="/wishlist" className={linkStyles}>
                  Wishlist
                </Link>
              </li>
              <li className={liStyles}>
                <Link href="/orders" className={linkStyles}>
                  My Orders
                </Link>
              </li>
              <li className={liStyles}>
                <Link href="#" className={linkStyles}>
                  Size Guide
                </Link>
              </li>
              <li className={liStyles}>
                <Link href="#" className={linkStyles}>
                  Installation Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <FaMapMarkerAlt className="mt-1 text-red-500 flex-shrink-0" />
                <span>
                  321/1, 80 ft road, K Channasandra Main Rd,<br />
                  near canara bank, horamavu post,<br />
                  Kalkere, Bengaluru, Karnataka 560113
                </span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <FaPhone className="text-red-500 flex-shrink-0" />
                <a href="tel:+919738522119" className={linkStyles}>
                  097385 22119
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <FaEnvelope className="text-red-500 flex-shrink-0" />
                <a href="mailto:info@slntilesshowroom.com" className={linkStyles}>
                  info@slntilesshowroom.com
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <p className="text-gray-400 text-sm mb-2">Business Hours:</p>
              <p className="text-gray-300 text-sm">Mon - Sat: 9:00 AM - 7:00 PM</p>
              <p className="text-gray-300 text-sm">Sunday: 10:00 AM - 5:00 PM</p>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {new Date().getFullYear()} SLN TILES SHOWROOM. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-6 text-sm">
              <Link href="/legal/privacy" className={linkStyles}>
                Privacy Policy
              </Link>
              <Link href="/legal/terms" className={linkStyles}>
                Terms & Conditions
              </Link>
              <Link href="/legal/shipping" className={linkStyles}>
                Shipping Policy
              </Link>
              <Link href="/legal/returns" className={linkStyles}>
                Returns & Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
