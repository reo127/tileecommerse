"use client";

import { useState } from "react";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

interface WishlistButtonProps {
    productId: string;
}

export const WishlistButton = ({ productId: _productId }: WishlistButtonProps) => {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setIsLoading(true);

        // TODO: Implement actual wishlist logic
        // For now, just toggle the state
        setTimeout(() => {
            setIsWishlisted(!isWishlisted);
            setIsLoading(false);
        }, 300);
    };

    return (
        <button
            onClick={handleToggleWishlist}
            disabled={isLoading}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110 ${isWishlisted
                ? 'bg-red-500 text-white'
                : 'bg-white/90 backdrop-blur-sm text-slate-700 hover:bg-white'
                }`}
            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            {isWishlisted ? (
                <FaHeart className="w-5 h-5" />
            ) : (
                <FiHeart className="w-5 h-5" />
            )}
        </button>
    );
};
