"use client";

import { useState } from "react";
import Link from "next/link";
import { HiPlus, HiPencil, HiStar, HiTrash } from "react-icons/hi";
import { FiImage } from "react-icons/fi";

interface Brand {
    _id: string;
    name: string;
    description: string;
    image?: string; // Optional for now, will be populated from backend later
}

export default function AdminBrandsPage() {
    // Mock data for now - will connect to backend later
    const [brands, setBrands] = useState<Brand[]>([
        {
            _id: "1",
            name: "Premium Tiles Co.",
            description: "Leading manufacturer of premium quality tiles for residential and commercial spaces",
            image: undefined // Placeholder - no image for mock data
        },
        {
            _id: "2",
            name: "Luxury Ceramics",
            description: "Specializing in luxury ceramic and porcelain tiles with modern designs",
            image: undefined // Placeholder - no image for mock data
        },
        {
            _id: "3",
            name: "Elite Marble",
            description: "Premium marble tiles with exquisite patterns and durability",
            image: undefined // Placeholder - no image for mock data
        }
    ]);
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [brandToDelete, setBrandToDelete] = useState<{ id: string; name: string } | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const showSuccessMessage = (message: string) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(null), 5000);
    };

    const openDeleteModal = (brandId: string, brandName: string) => {
        setBrandToDelete({ id: brandId, name: brandName });
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setBrandToDelete(null);
    };

    const confirmDelete = async () => {
        if (!brandToDelete) return;

        setDeleteLoading(brandToDelete.id);
        setShowDeleteModal(false);

        // Simulate delete - will connect to backend later
        setTimeout(() => {
            setBrands(brands.filter(b => b._id !== brandToDelete.id));
            showSuccessMessage(`"${brandToDelete.name}" deleted successfully!`);
            setDeleteLoading(null);
            setBrandToDelete(null);
        }, 1000);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Brands Management</h1>
                    <p className="text-slate-600 mt-1">
                        Manage all your product brands ({brands.length} brands)
                    </p>
                </div>
                <Link
                    href="/admin/brand/create"
                    className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl"
                >
                    <HiPlus className="w-5 h-5" />
                    <span className="font-medium">Add Brand</span>
                </Link>
            </div>

            {/* Brands Grid */}
            <div className="bg-white rounded-xl shadow-md border border-slate-200">
                {brands.length === 0 ? (
                    <div className="text-center py-20">
                        <HiStar className="w-20 h-20 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">
                            No Brands Yet
                        </h3>
                        <p className="text-slate-600 mb-6">
                            Start adding brands to showcase your product manufacturers
                        </p>
                        <Link
                            href="/admin/brand/create"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            <HiPlus className="w-5 h-5" />
                            <span className="font-medium">Add Your First Brand</span>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                        {brands.map((brand) => (
                            <div
                                key={brand._id}
                                className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition-all group"
                            >
                                {/* Brand Image/Icon */}
                                <div className="relative h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden">
                                    {brand.image ? (
                                        <img
                                            src={brand.image}
                                            alt={brand.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        // Placeholder when no image
                                        <div className="flex flex-col items-center justify-center text-white">
                                            <FiImage className="w-20 h-20 opacity-60 mb-2" />
                                            <p className="text-sm opacity-80">No image</p>
                                        </div>
                                    )}
                                </div>

                                {/* Brand Info */}
                                <div className="p-4">
                                    <h3 className="font-semibold text-lg text-slate-900 mb-2">
                                        {brand.name}
                                    </h3>
                                    <p className="text-sm text-slate-600 mb-4 line-clamp-2 min-h-[40px]">
                                        {brand.description}
                                    </p>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/admin/brand/${brand._id}/edit`}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-orange-500 hover:text-white transition-colors"
                                        >
                                            <HiPencil className="w-4 h-4" />
                                            <span className="font-medium">Edit</span>
                                        </Link>
                                        <button
                                            onClick={() => openDeleteModal(brand._id, brand.name)}
                                            disabled={deleteLoading === brand._id}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {deleteLoading === brand._id ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                                    <span className="font-medium">Deleting...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <HiTrash className="w-4 h-4" />
                                                    <span className="font-medium">Delete</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && brandToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-slideUp">
                        <div className="p-6">
                            {/* Icon */}
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <HiTrash className="w-8 h-8 text-red-600" />
                            </div>

                            {/* Title */}
                            <h3 className="text-2xl font-bold text-slate-900 text-center mb-2">
                                Delete Brand?
                            </h3>

                            {/* Message */}
                            <p className="text-slate-600 text-center mb-6">
                                Are you sure you want to delete <span className="font-semibold text-slate-900">"{brandToDelete.name}"</span>? This action cannot be undone.
                            </p>

                            {/* Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={closeDeleteModal}
                                    className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 py-3 px-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium shadow-lg hover:shadow-xl"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Toast */}
            {successMessage && (
                <div className="fixed top-4 right-4 z-50 animate-slideInRight">
                    <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px]">
                        <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="font-medium">{successMessage}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
