"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export const ProductImageGallery = ({ images, productName }: ProductImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(0);

  // If no images, use a default
  const imageList = images.length > 0 ? images : ["/placeholder-tile.jpg"];

  const goPrev = () => setSelectedImage((prev) => (prev > 0 ? prev - 1 : prev));
  const goNext = () => setSelectedImage((prev) => (prev < imageList.length - 1 ? prev + 1 : prev));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [imageList.length]);

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Thumbnails with up/down arrows */}
      <div className="flex lg:flex-col items-center gap-2 order-2 lg:order-1">
        {/* Up arrow */}
        <button
          onClick={goPrev}
          disabled={selectedImage === 0}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-orange-50 hover:border-orange-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Previous image"
        >
          <FaChevronUp className="w-3 h-3 text-gray-600" />
        </button>

        {/* Thumbnail list */}
        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto max-h-[400px]">
          {imageList.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`flex-shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden transition-all ${
                selectedImage === index
                  ? "border-orange-500 ring-2 ring-orange-200"
                  : "border-gray-300 hover:border-orange-300"
              }`}
            >
              <Image
                src={img}
                alt={`${productName} - View ${index + 1}`}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>

        {/* Down arrow */}
        <button
          onClick={goNext}
          disabled={selectedImage === imageList.length - 1}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-orange-50 hover:border-orange-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Next image"
        >
          <FaChevronDown className="w-3 h-3 text-gray-600" />
        </button>
      </div>

      {/* Main Image */}
      <div className="flex-1 order-1 lg:order-2">
        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
          <Image
            src={imageList[selectedImage]}
            alt={productName}
            fill
            className="object-contain"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />

          {/* Image counter */}
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            {selectedImage + 1} / {imageList.length}
          </div>
        </div>
      </div>
    </div>
  );
};
