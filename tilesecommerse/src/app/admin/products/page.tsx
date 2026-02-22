"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { HiPlus, HiPencil, HiShoppingBag, HiTrash } from "react-icons/hi";
import { FiChevronLeft, FiChevronRight, FiSearch, FiX } from "react-icons/fi";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1';

interface Product {
  _id: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  cuttedPrice: number;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  subcategory?: {
    _id: string;
    name: string;
    slug: string;
  };
  images: Array<{ url: string; public_id: string; isFeatured?: boolean }>;
  stock: number;
  brand?: {
    name: string;
    logo?: { url: string; public_id: string };
  };
  material?: string;
  finish?: string;
  color?: string;
  warranty?: number;
  hasVariants?: boolean;
  variants?: Array<{
    color?: string;
    size?: string;
    finish?: string;
    price?: number;
    stock?: number;
  }>;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [successTimeoutId, setSuccessTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Search and Pagination state
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProducts();

    // Cleanup function
    return () => {
      if (successTimeoutId) {
        clearTimeout(successTimeoutId);
      }
    };
  }, [searchQuery, currentPage, itemsPerPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');

      // Fetch ALL products (backend doesn't support pagination)
      const response = await fetch(`${API_BASE_URL}/admin/products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        cache: 'no-store',
      });

      const result = await response.json();

      if (result.success) {
        let allProducts = result.products || [];

        // Client-side filtering by search query
        if (searchQuery) {
          const searchLower = searchQuery.toLowerCase();
          allProducts = allProducts.filter((product: Product) =>
            product.name?.toLowerCase().includes(searchLower) ||
            product.description?.toLowerCase().includes(searchLower) ||
            product.category?.name?.toLowerCase().includes(searchLower) ||
            product.brand?.name?.toLowerCase().includes(searchLower)
          );
        }

        // Client-side pagination
        const totalCount = allProducts.length;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedProducts = allProducts.slice(startIndex, endIndex);

        setProducts(paginatedProducts);
        setTotalProducts(totalCount);
        setTotalPages(Math.ceil(totalCount / itemsPerPage));
      } else {
        setError(result.message || 'Failed to fetch products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const showSuccessMessage = (message: string) => {
    // Clear any existing timeout
    if (successTimeoutId) {
      clearTimeout(successTimeoutId);
    }

    setSuccessMessage(message);
    const timeoutId = setTimeout(() => setSuccessMessage(null), 5000);
    setSuccessTimeoutId(timeoutId);
  };

  const openDeleteModal = (productId: string, productName: string) => {
    setProductToDelete({ id: productId, name: productName });
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    setDeleteLoading(productToDelete.id);
    setShowDeleteModal(false);

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/admin/product/${productToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      const result = await response.json();

      if (result.success) {
        showSuccessMessage(`"${productToDelete.name}" deleted successfully!`);
        fetchProducts(); // Refresh to update pagination
      } else {
        setError(result.message || 'Failed to delete product');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product');
    } finally {
      setDeleteLoading(null);
      setProductToDelete(null);
    }
  };

  // Search handlers
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput.trim());
    setCurrentPage(1); // Reset to page 1 on new search
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to page 1 when changing items per page
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const itemsPerPageOptions = [6, 12, 18, 24, 30];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Products Management</h1>
          <p className="text-slate-600 mt-1">
            Manage all your tile products and inventory ({totalProducts} products)
          </p>
        </div>
        <Link
          href="/admin/products/create"
          className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl"
        >
          <HiPlus className="w-5 h-5" />
          <span className="font-medium">Add Product</span>
        </Link>
      </div>

      {/* Search Box */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-4">
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products by name..."
              className="w-full pl-12 pr-24 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="mr-3 absolute right-20 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full transition-colors"
                title="Clear search"
              >
                <FiX className="w-5 h-5 text-slate-400 hover:text-slate-600" />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-sm font-medium"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Items Per Page Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-600 font-medium whitespace-nowrap">Show:</span>
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
          {itemsPerPageOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleItemsPerPageChange(option)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                itemsPerPage === option
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <span className="text-sm text-slate-600 whitespace-nowrap">per page</span>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Products Grid */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <HiShoppingBag className="w-20 h-20 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              {searchQuery ? 'No Products Found' : 'No Products Yet'}
            </h3>
            <p className="text-slate-600 mb-6">
              {searchQuery ? 'Try adjusting your search terms' : 'Start adding products to your tile inventory'}
            </p>
            {!searchQuery && (
              <Link
                href="/admin/products/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <HiPlus className="w-5 h-5" />
                <span className="font-medium">Add Your First Product</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition-all group"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images.find(img => img.isFeatured)?.url || product.images[0].url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <HiShoppingBag className="w-16 h-16" />
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-2 right-2">
                    <span className="px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">
                      {product.category?.name || 'Uncategorized'}
                    </span>
                  </div>

                  {/* Stock Badge */}
                  <div className="absolute top-2 left-2">
                    <span className={`px-3 py-1 text-white text-xs font-semibold rounded-full ${product.stock > 50 ? 'bg-green-500' :
                        product.stock > 10 ? 'bg-yellow-500' :
                          'bg-red-500'
                      }`}>
                      Stock: {product.stock}
                    </span>
                  </div>

                  {/* Variants Badge */}
                  {product.hasVariants && product.variants && product.variants.length > 0 && (
                    <div className="absolute bottom-2 left-2">
                      <span className="px-3 py-1 bg-purple-500 text-white text-xs font-semibold rounded-full">
                        {product.variants.length} Variants
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-slate-900 mb-1 line-clamp-1">
                    {product.name}
                  </h3>

                  {/* Brand & Material */}
                  <div className="flex items-center gap-2 mb-2">
                    {product.brand?.name && (
                      <span className="text-sm text-slate-600">
                        {product.brand.name}
                      </span>
                    )}
                    {product.material && (
                      <>
                        {product.brand?.name && <span className="text-slate-400">•</span>}
                        <span className="text-sm text-slate-600 capitalize">
                          {product.material}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                    {product.shortDescription || product.description}
                  </p>

                  {/* Subcategory & Finish */}
                  {(product.subcategory || product.finish || product.color) && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {product.subcategory && (
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-md">
                          {product.subcategory.name}
                        </span>
                      )}
                      {product.finish && (
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md capitalize">
                          {product.finish}
                        </span>
                      )}
                      {product.color && (
                        <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-md capitalize">
                          {product.color}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Pricing */}
                  <div className="flex items-center gap-3 mb-4">
                    <div>
                      <p className="text-xs text-slate-500">Price</p>
                      <p className="text-xl font-bold text-orange-500">
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </p>
                    </div>
                    {product.cuttedPrice && product.cuttedPrice > product.price && (
                      <div>
                        <p className="text-xs text-slate-500">MRP</p>
                        <p className="text-sm font-semibold text-slate-400 line-through">
                          ₹{Number(product.cuttedPrice).toLocaleString("en-IN")}
                        </p>
                      </div>
                    )}
                    {product.cuttedPrice && product.cuttedPrice > product.price && (
                      <div className="ml-auto">
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">
                          {Math.round(((product.cuttedPrice - product.price) / product.cuttedPrice) * 100)}% OFF
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/products/${product._id}/edit`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-orange-500 hover:text-white transition-colors"
                    >
                      <HiPencil className="w-4 h-4" />
                      <span className="font-medium">Edit</span>
                    </Link>
                    <button
                      onClick={() => openDeleteModal(product._id, product.name)}
                      disabled={deleteLoading === product._id}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deleteLoading === product._id ? (
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

      {/* Pagination */}
      {totalProducts > 0 && totalPages > 1 && (
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
          {/* Page Navigation */}
          <div className="flex items-center justify-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
            >
              <FiChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, index) => (
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className="px-2 text-slate-400">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page as number)}
                    className={`min-w-[40px] h-10 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      currentPage === page
                        ? "bg-orange-500 text-white shadow-sm"
                        : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
            >
              <span className="hidden sm:inline">Next</span>
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Page Info */}
          <div className="text-center text-sm text-slate-500 mt-4">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && productToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-slideUp">
            <div className="p-6">
              {/* Icon */}
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiTrash className="w-8 h-8 text-red-600" />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-slate-900 text-center mb-2">
                Delete Product?
              </h3>

              {/* Message */}
              <p className="text-slate-600 text-center mb-6">
                Are you sure you want to delete <span className="font-semibold text-slate-900">"{productToDelete.name}"</span>? This action cannot be undone.
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
