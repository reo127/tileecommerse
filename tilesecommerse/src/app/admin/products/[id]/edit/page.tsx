"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FiUpload, FiCheck, FiX, FiArrowLeft, FiStar, FiTrash2, FiPlus } from "react-icons/fi";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCategories } from "@/hooks/category/queries/useCategories";

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
  const [selectedCategory, setSelectedCategory] = useState('');
  const [imagePreviews, setImagePreviews] = useState<Array<{ file?: File; preview: string; id: string; isExisting?: boolean }>>([]);
  const [featuredImageIndex, setFeaturedImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [specCount, setSpecCount] = useState(2);

  const { categories, isLoading: categoriesLoading } = useCategories();

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
        setSelectedCategory(result.product.category?._id || result.product.category || '');

        // Set existing images
        if (result.product.images && result.product.images.length > 0) {
          const existingImages = result.product.images.map((img: any, index: number) => ({
            preview: img.url,
            id: `existing-${index}`,
            isExisting: true
          }));
          setImagePreviews(existingImages);

          // Find featured image
          const featuredIndex = result.product.images.findIndex((img: any) => img.isFeatured);
          if (featuredIndex !== -1) {
            setFeaturedImageIndex(featuredIndex);
          }
        }

        // Set spec count based on existing specs
        if (result.product.specifications && result.product.specifications.length > 0) {
          setSpecCount(Math.max(2, result.product.specifications.length));
        }
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

  const handleImageSelect = (files: FileList | null) => {
    if (!files) return;

    const newImages = Array.from(files).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9),
      isExisting: false
    }));

    setImagePreviews(prev => [...prev, ...newImages]);
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
    handleImageSelect(e.dataTransfer.files);
  };

  const removeImage = (id: string) => {
    setImagePreviews(prev => {
      const newPreviews = prev.filter(img => img.id !== id);
      if (featuredImageIndex >= newPreviews.length) {
        setFeaturedImageIndex(Math.max(0, newPreviews.length - 1));
      }
      return newPreviews;
    });
  };

  const setFeaturedImage = (index: number) => {
    setFeaturedImageIndex(index);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData(e.currentTarget);
      setUploadProgress('Preparing product data...');

      // Collect highlights
      const highlights = [];
      for (let i = 1; i <= 4; i++) {
        const highlight = formData.get(`highlight${i}`) as string;
        if (highlight && highlight.trim()) {
          highlights.push(highlight.trim());
        }
      }

      // Collect specifications
      const specifications = [];
      for (let i = 1; i <= specCount; i++) {
        const title = formData.get(`specTitle${i}`) as string;
        const description = formData.get(`specDesc${i}`) as string;
        if (title && description) {
          specifications.push(JSON.stringify({ title, description }));
        }
      }

      // Collect dimensions
      const length = formData.get('length') as string;
      const width = formData.get('width') as string;
      const unit = formData.get('unit') as string;
      const dimensions = (length && width) ? JSON.stringify({ length: Number(length), width: Number(width), unit }) : undefined;

      const requestBody: any = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        shortDescription: formData.get('shortDescription') as string,
        price: Number(formData.get('price')),
        cuttedPrice: Number(formData.get('cuttedPrice')),
        category: formData.get('category') as string,
        subcategory: formData.get('subcategory') as string || undefined,
        brandname: formData.get('brandname') as string,
        stock: Number(formData.get('stock')),
        warranty: Number(formData.get('warranty')),
        highlights,
        specifications,
        material: formData.get('material') as string || undefined,
        finish: formData.get('finish') as string || undefined,
        color: formData.get('color') as string || undefined,
        thickness: formData.get('thickness') ? Number(formData.get('thickness')) : undefined,
        dimensions,
      };

      // Handle new images if uploaded
      const newImageFiles = imagePreviews.filter(img => !img.isExisting && img.file);
      if (newImageFiles.length > 0) {
        setUploadProgress('Processing images...');
        const images = [];
        for (let i = 0; i < newImageFiles.length; i++) {
          if (newImageFiles[i].file) {
            setUploadProgress(`Processing image ${i + 1} of ${newImageFiles.length}...`);
            const base64 = await fileToBase64(newImageFiles[i].file!);
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

        {/* Form Content - Accordion Sections */}
        <Accordion type="multiple" defaultValue={["basic"]} className="space-y-4">

          {/* 1. Basic Information */}
          <AccordionItem value="basic" className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <AccordionTrigger className="px-8 py-6 hover:no-underline hover:bg-slate-50 transition-colors">
              <h2 className="text-xl font-medium text-slate-900">1. Basic Information</h2>
            </AccordionTrigger>
            <AccordionContent className="px-8 pb-8">
              <div className="grid md:grid-cols-2 gap-6 pt-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Product Name</label>
                  <input
                    name="name"
                    required
                    defaultValue={product.name}
                    placeholder="Premium Marble Floor Tiles"
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
                    placeholder="Elegant marble tiles with luxurious finish..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all resize-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Short Description</label>
                  <input
                    name="shortDescription"
                    defaultValue={product.shortDescription}
                    placeholder="Short description of the product"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                  <select
                    name="category"
                    required
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                  >
                    <option value="">Select category</option>
                    {categoriesLoading ? (
                      <option disabled>Loading categories...</option>
                    ) : Array.isArray(categories) && categories.length > 0 ? (
                      categories.map((cat: any) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>No categories available</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Brand Name</label>
                  <input
                    name="brandname"
                    defaultValue={product.brand?.name}
                    placeholder="Premium Tiles Co."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Sub Category</label>
                  <select
                    name="subcategory"
                    disabled={!selectedCategory}
                    defaultValue={product.subcategory?._id || product.subcategory}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">{selectedCategory ? 'Select subcategory' : 'Select category first'}</option>
                    {selectedCategory && Array.isArray(categories) && categories.length > 0 && (
                      categories
                        .find((cat: any) => cat._id === selectedCategory)
                        ?.children?.map((subcat: any) => (
                          <option key={subcat._id} value={subcat._id}>
                            {subcat.name}
                          </option>
                        ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Warranty (years)</label>
                  <input
                    name="warranty"
                    type="number"
                    defaultValue={product.warranty || 5}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                  />
                </div>

              </div>
            </AccordionContent>
          </AccordionItem>

          {/* 2. Images */}
          <AccordionItem value="images" className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <AccordionTrigger className="px-8 py-6 hover:no-underline hover:bg-slate-50 transition-colors">
              <h2 className="text-xl font-medium text-slate-900">2. Images</h2>
            </AccordionTrigger>
            <AccordionContent className="px-8 pb-8">
              <div className="space-y-6 pt-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Product Images {imagePreviews.length > 0 && `(${imagePreviews.length})`}
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
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageSelect(e.target.files)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="py-12 px-4 text-center pointer-events-none">
                      <FiUpload className={`w-12 h-12 mx-auto mb-3 ${isDragging ? 'text-orange-500' : 'text-slate-400'}`} />
                      <p className="text-sm font-medium text-slate-700 mb-1">
                        {isDragging ? 'Drop images here' : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-xs text-slate-500">
                        PNG, JPG, GIF up to 10MB each
                      </p>
                    </div>
                  </div>

                  {/* Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium text-slate-700">
                          Selected Images
                        </p>
                        <p className="text-xs text-slate-500">
                          Click <FiStar className="inline w-3 h-3" /> to set as featured image
                        </p>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {imagePreviews.map((image, index) => (
                          <div
                            key={image.id}
                            className={`relative group rounded-lg overflow-hidden border-2 transition-all ${index === featuredImageIndex
                              ? 'border-orange-500 ring-2 ring-orange-200'
                              : 'border-slate-200 hover:border-slate-300'
                              }`}
                          >
                            <div className="aspect-square bg-slate-100">
                              <img
                                src={image.preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {index === featuredImageIndex && (
                              <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                                <FiStar className="w-3 h-3 fill-current" />
                                Featured
                              </div>
                            )}

                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                              <button
                                type="button"
                                onClick={() => setFeaturedImage(index)}
                                className="p-2 bg-white rounded-lg hover:bg-orange-500 hover:text-white transition-colors"
                                title="Set as featured"
                              >
                                <FiStar className={index === featuredImageIndex ? 'fill-current' : ''} />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeImage(image.id)}
                                className="p-2 bg-white text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                                title="Remove image"
                              >
                                <FiTrash2 />
                              </button>
                            </div>

                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs font-medium">
                              {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Brand Logo (Optional)</label>
                  <input
                    name="logo"
                    type="file"
                    accept="image/*"
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-slate-900 file:text-white file:text-sm hover:file:bg-slate-800"
                  />
                  <p className="text-xs text-slate-500 mt-2">Leave empty to keep existing logo</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* 3. Highlights */}
          <AccordionItem value="highlights" className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <AccordionTrigger className="px-8 py-6 hover:no-underline hover:bg-slate-50 transition-colors">
              <h2 className="text-xl font-medium text-slate-900">3. Highlights</h2>
            </AccordionTrigger>
            <AccordionContent className="px-8 pb-8">
              <div className="space-y-6 pt-4">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-700">Product Highlights</label>
                  <input name="highlight1" defaultValue={product.highlights?.[0]} placeholder="Highlight 1" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
                  <input name="highlight2" defaultValue={product.highlights?.[1]} placeholder="Highlight 2" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
                  <input name="highlight3" defaultValue={product.highlights?.[2]} placeholder="Highlight 3" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
                  <input name="highlight4" defaultValue={product.highlights?.[3]} placeholder="Highlight 4" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* 4. Specifications */}
          <AccordionItem value="specs" className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <AccordionTrigger className="px-8 py-6 hover:no-underline hover:bg-slate-50 transition-colors">
              <h2 className="text-xl font-medium text-slate-900">4. Specifications</h2>
            </AccordionTrigger>
            <AccordionContent className="px-8 pb-8">
              <div className="grid md:grid-cols-2 gap-6 pt-4">
                {/* Material */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Material</label>
                  <select name="material" defaultValue={product.material} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all">
                    <option value="">Select material</option>
                    <option value="ceramic">Ceramic</option>
                    <option value="porcelain">Porcelain</option>
                    <option value="marble">Marble</option>
                    <option value="vitrified">Vitrified</option>
                    <option value="granite">Granite</option>
                  </select>
                </div>

                {/* Finish */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Finish</label>
                  <select name="finish" defaultValue={product.finish} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all">
                    <option value="">Select finish</option>
                    <option value="glossy">Glossy</option>
                    <option value="matte">Matte</option>
                    <option value="polished">Polished</option>
                    <option value="anti-skid">Anti-Skid</option>
                  </select>
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Color</label>
                  <input name="color" defaultValue={product.color} placeholder="White, Beige, Gray..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
                </div>

                {/* Length */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Length</label>
                  <input name="length" type="number" defaultValue={product.dimensions?.length} placeholder="24" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
                </div>

                {/* Width */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Width</label>
                  <input name="width" type="number" defaultValue={product.dimensions?.width} placeholder="24" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
                </div>

                {/* Unit */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Unit</label>
                  <select name="unit" defaultValue={product.dimensions?.unit || 'inches'} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all">
                    <option value="inches">Inches</option>
                    <option value="cm">CM</option>
                    <option value="mm">MM</option>
                  </select>
                </div>

                {/* Thickness */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Thickness (mm)</label>
                  <input name="thickness" type="number" defaultValue={product.thickness} placeholder="8" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Price (₹)</label>
                  <input
                    name="price"
                    type="number"
                    required
                    defaultValue={product.price}
                    placeholder="999"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                  />
                </div>

                {/* MRP */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">MRP (₹)</label>
                  <input
                    name="cuttedPrice"
                    type="number"
                    required
                    defaultValue={product.cuttedPrice}
                    placeholder="1499"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                  />
                </div>

                {/* Stock */}
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

                <div className="md:col-span-2 pt-4">
                  <label className="block text-sm font-medium text-slate-700 mb-3">Technical Specifications</label>
                  <div className="space-y-3">
                    {Array.from({ length: specCount }, (_, index) => (
                      <div key={index} className="grid grid-cols-2 gap-4">
                        <input
                          name={`specTitle${index + 1}`}
                          defaultValue={product.specifications?.[index]?.title}
                          placeholder={`Specification Title ${index + 1}`}
                          className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                        />
                        <input
                          name={`specDesc${index + 1}`}
                          defaultValue={product.specifications?.[index]?.description}
                          placeholder={`Specification Description ${index + 1}`}
                          className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                        />
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => setSpecCount(specCount + 1)}
                      className="w-full py-3 px-4 border-2 border-dashed border-slate-300 text-slate-600 rounded-xl hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 group"
                    >
                      <FiPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium">Add Specification</span>
                    </button>
                  </div>
                </div>

              </div>
            </AccordionContent>
          </AccordionItem>

        </Accordion>

        {/* Submit Button */}
        <div className="flex gap-4 pt-8">
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
      </form>
    </div>
  );
}
