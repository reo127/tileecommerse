"use client";

import { useState } from "react";
import { FiShoppingCart } from "react-icons/fi";

interface AddToCartButtonProps {
    productId: string;
}

export const AddToCartButton = ({ productId: _productId }: AddToCartButtonProps) => {
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setIsAdding(true);

        // TODO: Implement actual add to cart logic
        // For now, just simulate the action
        setTimeout(() => {
            setIsAdding(false);
            // You can add toast notification here
        }, 500);
    };

    return (
        <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50"
        >
            <FiShoppingCart className="w-5 h-5" />
            {isAdding ? 'Adding...' : 'Add to Cart'}
        </button>
    );
};
