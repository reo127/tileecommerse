"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FiUpload, FiCheck, FiX, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter();
  const [productId, setProductId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadProgress, setUploadProgress] = useState('');
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    params.then(({ id }) => {
      setProductId(id);
      fetchProduct(id);
    });
  }, [params]);

  const fetchProduct = async (id: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/product/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      const result = await response.json();

      if (result.success) {
        setProduct(result.product);
      } else {
        setError(result.message || 'Failed to fetch product');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData(e.currentTarget);
      setUploadProgress('Preparing product data...');

      const name = formData.get('name') as string;
      const description = formData.get('description') as string;
      const price = formData.get('price') as string;
      const cuttedPrice = formData.get('cuttedPrice') as string;
      const category = formData.get('category') as string;
      const brandname = formData.get('brandname') as string;
      const stock = formData.get('stock') as string;
      const warranty = formData.get('warranty') as string;

      const requestBody: any = {
        name,
        description,
        price: Number(price),
        cuttedPrice: Number(cuttedPrice),
        category,
        brandname,
        stock: Number(stock),
        warranty: Number(warranty),
      };

      // Handle new images if uploaded
      const imageFiles = formData.getAll('images') as File[];
      if (imageFiles && imageFiles.length > 0 && imageFiles[0] && imageFiles[0].size > 0) {
        setUploadProgress('Processing images...');
        const images = [];
        for (let i = 0; i < imageFiles.length; i++) {
          if (imageFiles[i] && imageFiles[i].size > 0) {
            setUploadProgress(`Processing image ${i + 1} of ${imageFiles.length}...`);
            const base64 = await fileToBase64(imageFiles[i]);
            images.push(base64);
          }
        }
        requestBody.images = images;
      }

      // Handle new logo if uploaded
      const logoFile = formData.get('logo') as File;
      if (logoFile && logoFile.size > 0) {
        setUploadProgress('Processing brand logo...');
        requestBody.logo = await fileToBase64(logoFile);
      }

      setUploadProgress('Updating product...');
      const token = localStorage.getItem('auth_token');

      const response = await fetch(`${API_BASE_URL}/admin/product/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message || 'Error updating product');
        setUploadProgress('');
        return;
      }

      setSuccess('Product updated successfully!');
      setUploadProgress('');
      setTimeout(() => {
        router.push('/admin/products');
      }, 1500);

    } catch (err) {
      console.error('Error:', err);
      setError('An unexpected error occurred');
      setUploadProgress('');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600"
        >
          <FiArrowLeft />
          Back to Products
        </Link>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
          >
            <FiArrowLeft />
            Back to Products
          </Link>
          <h1 className="text-4xl font-light text-slate-900 mb-3 tracking-tight">Edit Product</h1>
          <p className="text-slate-500 text-lg font-light">Update product information</p>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3">
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

        {uploadProgress && (
          <div className="mb-8 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
            <p className="text-blue-700 text-sm text-center">{uploadProgress}</p>
          </div>
        )}

        {/* Form Content */}
        <div className="space-y-8">
          {/* Basic Information */}
          <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-xl font-medium text-slate-900 mb-6 pb-4 border-b border-slate-100">Basic Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Product Name</label>
                <input
                  name="name"
                  required
                  defaultValue={product.name}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  defaultValue={product.description}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Price (₹)</label>
                <input
                  name="price"
                  type="number"
                  required
                  defaultValue={product.price}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">MRP (₹)</label>
                <input
                  name="cuttedPrice"
                  type="number"
                  required
                  defaultValue={product.cuttedPrice}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                <input
                  name="category"
                  required
                  defaultValue={product.category}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Stock</label>
                <input
                  name="stock"
                  type="number"
                  required
                  defaultValue={product.stock}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Brand Name</label>
                <input
                  name="brandname"
                  required
                  defaultValue={product.brand?.name}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Warranty (years)</label>
                <input
                  name="warranty"
                  type="number"
                  required
                  defaultValue={product.warranty}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </section>

          {/* Current Images */}
          {product.images && product.images.length > 0 && (
            <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-xl font-medium text-slate-900 mb-6 pb-4 border-b border-slate-100">Current Images</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {product.images.map((img: any, index: number) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200">
                    <img src={img.url} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Update Images */}
          <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-xl font-medium text-slate-900 mb-6 pb-4 border-b border-slate-100">Update Images (Optional)</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">New Product Images</label>
                <input
                  name="images"
                  type="file"
                  accept="image/*"
                  multiple
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-slate-900 file:text-white file:text-sm hover:file:bg-slate-800"
                />
                <p className="text-xs text-slate-500 mt-2">Leave empty to keep existing images</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">New Brand Logo</label>
                <input
                  name="logo"
                  type="file"
                  accept="image/*"
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-slate-900 file:text-white file:text-sm hover:file:bg-slate-800"
                />
                <p className="text-xs text-slate-500 mt-2">Leave empty to keep existing logo</p>
              </div>
            </div>
          </section>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <Link
              href="/admin/products"
              className="flex-1 py-4 px-6 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl hover:bg-slate-50 transition-all duration-200 font-medium text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-4 px-6 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <FiCheck className="w-5 h-5" />
                  <span>Update Product</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
