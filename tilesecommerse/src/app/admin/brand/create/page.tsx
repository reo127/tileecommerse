"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FiCheck, FiX, FiUpload, FiImage } from "react-icons/fi";

export default function CreateBrandPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleImageSelect = (file: File | null) => {
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImageSelect(file);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const formData = new FormData(e.currentTarget);
            const name = formData.get('name') as string;
            const description = formData.get('description') as string;
            const image = formData.get('image') as File;

            // Simulate API call - will connect to backend later
            await new Promise(resolve => setTimeout(resolve, 1500));

            setSuccess('Brand created successfully! Redirecting...');

            // Reset form
            (e.target as HTMLFormElement).reset();
            setImagePreview(null);

            // Redirect after 2 seconds
            setTimeout(() => {
                router.push('/admin/brand');
            }, 2000);

        } catch (err) {
            console.error('Error:', err);
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-light text-slate-900 mb-3 tracking-tight">Create New Brand</h1>
                    <p className="text-slate-500 text-lg font-light">Add a new brand to showcase your manufacturers</p>
                </div>

                {/* Status Messages */}
                {error && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-shake">
                        <FiX className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mb-8 p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3">
                        <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <p className="text-green-700 text-sm">{success}</p>
                    </div>
                )}

                {/* Form Content */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
                    <h2 className="text-xl font-medium text-slate-900 mb-6 pb-4 border-b border-slate-100">Brand Information</h2>

                    <div className="space-y-6">
                        {/* Brand Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Brand Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="name"
                                required
                                placeholder="e.g., Premium Tiles Co., Luxury Ceramics, Elite Marble"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            />
                            <p className="text-xs text-slate-500 mt-2">Enter the official name of the brand</p>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                required
                                rows={4}
                                placeholder="Describe the brand, its specialty, and what makes it unique..."
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                            />
                            <p className="text-xs text-slate-500 mt-2">Provide a brief description about the brand and its products</p>
                        </div>

                        {/* Brand Logo/Image */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-3">
                                Brand Logo <span className="text-red-500">*</span>
                            </label>

                            {/* Upload Area */}
                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`relative border-2 border-dashed rounded-xl transition-all ${isDragging
                                        ? 'border-orange-500 bg-orange-50'
                                        : 'border-slate-300 bg-slate-50'
                                    }`}
                            >
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    required
                                    onChange={(e) => handleImageSelect(e.target.files?.[0] || null)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />

                                {imagePreview ? (
                                    <div className="p-4">
                                        <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-100">
                                            <img
                                                src={imagePreview}
                                                alt="Brand logo preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                                                <p className="text-white font-medium">Click to change logo</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-12 px-4 text-center pointer-events-none">
                                        <FiUpload className={`w-12 h-12 mx-auto mb-3 ${isDragging ? 'text-orange-500' : 'text-slate-400'}`} />
                                        <p className="text-sm font-medium text-slate-700 mb-1">
                                            {isDragging ? 'Drop logo here' : 'Click to upload or drag and drop'}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            PNG, JPG, GIF up to 10MB
                                        </p>
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-slate-500 mt-2">Upload the brand's official logo or representative image</p>
                        </div>
                    </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 mt-8">
                    <button
                        type="button"
                        onClick={() => router.push('/admin/brand')}
                        className="flex-1 py-4 px-6 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl hover:bg-slate-50 transition-all duration-200 font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-4 px-6 bg-orange-500 text-white rounded-2xl hover:bg-orange-600 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span>Creating...</span>
                            </>
                        ) : (
                            <>
                                <FiCheck className="w-5 h-5" />
                                <span>Create Brand</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
