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
import { colorMapping } from "@/constants/colors";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1';

// Finish types for tiles and products
const FINISH_TYPES = [
  'Glossy', 'High Gloss', 'Super Gloss', 'Matte', 'Satin', 'Polished',
  'Semi-Polished', 'Lappato', 'Mirror Finish', 'Brushed Finish',
  'Chrome Finish', 'Powder Coated', 'Painted', 'Enamel Coated',
  'Textured', 'Structured', 'Rustic', 'Anti-Skid', 'Sugar Finish',
  'Carving', '3D Finish', 'Wooden Finish', 'Marble Finish',
  'Granite Finish', 'Stone Finish', 'Cement Finish', 'Concrete Finish',
  'Metallic Finish', 'Digital Printed', 'Frosted', 'Transparent',
  'Opaque', 'White Finish', 'Black Finish', 'Silver Finish',
  'Gold Finish', 'Rose Gold Finish'
];

// Material types for tiles and products
const MATERIAL_TYPES = [
  'Ceramic', 'Glazed Ceramic', 'Porcelain', 'Vitrified', 'Double Charge Vitrified',
  'Full Body Vitrified', 'GVT (Glazed Vitrified Tiles)', 'PGVT (Polished Glazed Vitrified Tiles)',
  'Marble', 'Marble Look', 'Granite', 'Granite Look', 'Stone', 'Slate', 'Travertine',
  'Quartz', 'Wood Look', 'Cement Finish', 'Concrete Look', 'Mosaic', '3D Tiles',
  'Digital Wall Tiles', 'Elevation Tiles', 'Glass Tiles', 'Metallic Finish',
  'Outdoor Tiles', 'Parking Tiles', 'Anti-Skid Tiles', 'Paver Tiles',
  'Vitreous China', 'Stainless Steel', 'Mild Steel', 'Cast Iron', 'Brass',
  'Copper', 'Aluminium', 'Galvanized Iron (GI)', 'PVC', 'CPVC', 'UPVC',
  'HDPE', 'Plastic', 'ABS Plastic', 'FRP (Fibre Reinforced Plastic)',
  'Glass', 'Toughened Glass', 'Acrylic', 'Cement', 'Concrete', 'Wood',
  'Engineered Wood', 'Plywood', 'MDF', 'HDF', 'Laminated Board',
  'Solar Glass', 'Silicon (Solar Grade)', 'Rubber'
];

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
  const [productId, setProductId] = useState<string>(''); // FIX: Added missing state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadProgress, setUploadProgress] = useState('');
  const [product, setProduct] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedSubSubcategory, setSelectedSubSubcategory] = useState('');
  const [imagePreviews, setImagePreviews] = useState<Array<{ file?: File; preview: string; id: string; isExisting?: boolean }>>([]);
  const [featuredImageIndex, setFeaturedImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [specCount, setSpecCount] = useState(2);

  // Variants state
  const [hasVariants, setHasVariants] = useState(false);
  const [variants, setVariants] = useState<Array<{
    id: string;
    color: string;
    size: string;
    productId: string;
    finish: string;
    price: string;
    stock: string;
  }>>([]);

  const { categories, isLoading: categoriesLoading } = useCategories();

  // Get selected category object
  const selectedCategoryObj = categories.find((cat: any) => cat._id === selectedCategory);

  // Get subcategories based on selected parent
  const subcategories = selectedCategoryObj?.children || [];

  // Get selected subcategory object
  const selectedSubcategoryObj = subcategories.find((sub: any) => sub._id === selectedSubcategory);

  // Get sub-subcategories based on selected subcategory
  const subSubcategories = selectedSubcategoryObj?.children || [];

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

        // Initialize category selections based on product's category
        const productCategoryId = result.product.category?._id || result.product.category || '';

        // Find which level this category belongs to and set all parent levels
        if (productCategoryId && categories.length > 0) {
          for (const parent of categories) {
            // Level 0 - Parent category
            if (parent._id === productCategoryId) {
              setSelectedCategory(parent._id);
              break;
            }

            // Level 1 - Subcategory
            if (parent.children) {
              for (const child of parent.children) {
                if (child._id === productCategoryId) {
                  setSelectedCategory(parent._id);
                  setSelectedSubcategory(child._id);
                  break;
                }

                // Level 2 - Sub-subcategory
                if (child.children) {
                  for (const subChild of child.children) {
                    if (subChild._id === productCategoryId) {
                      setSelectedCategory(parent._id);
                      setSelectedSubcategory(child._id);
                      setSelectedSubSubcategory(subChild._id);
                      break;
                    }
                  }
                }
              }
            }
          }
        } else {
          // Fallback if categories not loaded yet
          setSelectedCategory(productCategoryId);
        }

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

        // FIX: Load existing variants
        if (result.product.hasVariants && result.product.variants && result.product.variants.length > 0) {
          setHasVariants(true);
          const loadedVariants = result.product.variants.map((v: any, index: number) => ({
            id: `variant-${index}`,
            color: v.color || '',
            size: v.size || '',
            productId: v.productId || '',
            finish: v.finish || '',
            price: v.price?.toString() || '',
            stock: v.stock?.toString() || ''
          }));
          setVariants(loadedVariants);
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

  // Variant management functions
  const addVariant = () => {
    setVariants([...variants, {
      id: Math.random().toString(36).substr(2, 9),
      color: '',
      size: '',
      productId: '',
      finish: '',
      price: '',
      stock: ''
    }]);
  };

  const updateVariant = (id: string, field: string, value: string) => {
    setVariants(variants.map(v =>
      v.id === id ? { ...v, [field]: value } : v
    ));
  };

  const removeVariant = (id: string) => {
    setVariants(variants.filter(v => v.id !== id));
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
      for (let i = 1; i <= 6; i++) {
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

      // Collect tags
      const tags = formData.getAll('tags') as string[];

      // Get form values
      const categoryValue = formData.get('category') as string;
      const subcategoryValue = formData.get('subcategory') as string;
      const subSubcategoryValue = formData.get('subSubcategory') as string;

      // Use the deepest selected category level
      const finalCategory = subSubcategoryValue || subcategoryValue || categoryValue;

      const requestBody: any = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        shortDescription: formData.get('shortDescription') as string,
        price: Number(formData.get('price')),
        cuttedPrice: Number(formData.get('cuttedPrice')),
        category: finalCategory,
        subcategory: subcategoryValue || undefined,
        brandname: formData.get('brandname') as string,
        stock: Number(formData.get('stock')),
        warranty: Number(formData.get('warranty')),
        highlights,
        specifications,
        material: formData.get('material') as string || undefined,
        finish: formData.get('finish') as string || undefined,
        color: formData.get('color') as string || undefined,
        productId: formData.get('productId') as string || undefined,
        size: formData.get('size') as string || undefined,
        thickness: formData.get('thickness') ? Number(formData.get('thickness')) : undefined,
      };

      // Add tags if selected
      if (tags.length > 0) {
        requestBody.tags = JSON.stringify(tags);
      }

      // FIX: Handle variants properly
      requestBody.hasVariants = hasVariants;
      if (hasVariants && variants.length > 0) {
        requestBody.variants = JSON.stringify(variants);
      }

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

      // FIX: Send featured image index to update which image is featured
      requestBody.featuredImageIndex = featuredImageIndex;

      // Handle new logo if uploaded
      const logoFile = formData.get('logo') as File;
      if (logoFile && logoFile.size > 0) {
        setUploadProgress('Processing brand logo...');
        requestBody.logo = await fileToBase64(logoFile);
      }

      setUploadProgress('Updating product...');
      const token = localStorage.getItem('auth_token');

      console.log('=== FRONTEND: SENDING UPDATE ===');
      console.log('Product ID:', productId);
      console.log('Request Body:', requestBody);

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

      console.log('=== FRONTEND: RECEIVED RESPONSE ===');
      console.log('Response Status:', response.status);
      console.log('Response OK:', response.ok);
      console.log('Result:', result);

      if (!response.ok || !result.success) {
        console.error('=== UPDATE FAILED ===');
        console.error('Error:', result.message);
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

        {/* FIX: Changed defaultValue to match Create form - only "basic" open */}
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
                    required
                    defaultValue={product.shortDescription}
                    placeholder="Short description of the product"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                  />
                </div>

                {/* Category (Level 0) */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Category *</label>
                  <select
                    name="category"
                    required
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setSelectedSubcategory('');
                      setSelectedSubSubcategory('');
                    }}
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

                {/* Subcategory / Brand (Level 1) */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Brand</label>
                  <select
                    name="subcategory"
                    value={selectedSubcategory}
                    onChange={(e) => {
                      setSelectedSubcategory(e.target.value);
                      setSelectedSubSubcategory('');
                    }}
                    disabled={!selectedCategory || subcategories.length === 0}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">{!selectedCategory ? 'Select category first' : 'Select brand'}</option>
                    {subcategories.map((subcat: any) => (
                      <option key={subcat._id} value={subcat._id}>
                        {subcat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sub-subcategory (Level 2) */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Sub-category</label>
                  <select
                    name="subSubcategory"
                    value={selectedSubSubcategory}
                    onChange={(e) => setSelectedSubSubcategory(e.target.value)}
                    disabled={!selectedSubcategory || subSubcategories.length === 0}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">{!selectedSubcategory ? 'Select brand first' : (subSubcategories.length > 0 ? 'Select sub-category' : 'No sub-categories')}</option>
                    {subSubcategories.map((subSubcat: any) => (
                      <option key={subSubcat._id} value={subSubcat._id}>
                        {subSubcat.name}
                      </option>
                    ))}
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
                  <input name="highlight5" defaultValue={product.highlights?.[4]} placeholder="Highlight 5" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
                  <input name="highlight6" defaultValue={product.highlights?.[5]} placeholder="Highlight 6" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
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
                {/* FIX: Product ID moved to top like Create form */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Product ID</label>
                  <input name="productId" defaultValue={product.productId} placeholder="SKU-001" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
                </div>

                {/* Material */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Material</label>
                  <select name="material" defaultValue={product.material} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all">
                    <option value="">Select material</option>
                    {MATERIAL_TYPES.map((material) => (
                      <option key={material} value={material}>
                        {material}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Finish */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Finish</label>
                  <select name="finish" defaultValue={product.finish} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all">
                    <option value="">Select finish</option>
                    {FINISH_TYPES.map((finish) => (
                      <option key={finish} value={finish}>
                        {finish}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Color</label>
                  <select name="color" defaultValue={product.color} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all">
                    <option value="">Select color</option>
                    {Object.keys(colorMapping).map((color) => (
                      <option key={color} value={color}>
                        {color.charAt(0).toUpperCase() + color.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Size */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Size</label>
                  <input name="size" defaultValue={product.size} placeholder="24x24, 1200x600mm, etc." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
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

          {/* FIX: 5. Product Variants - moved to separate accordion like Create form */}
          <AccordionItem value="variants" className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <AccordionTrigger className="px-8 py-6 hover:no-underline hover:bg-slate-50 transition-colors">
              <h2 className="text-xl font-medium text-slate-900">5. Product Variants (Optional)</h2>
            </AccordionTrigger>
            <AccordionContent className="px-8 pb-8">
              <div className="space-y-6 pt-4">
                {/* Enable Variants Toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <h3 className="text-sm font-medium text-slate-900">Enable Product Variants</h3>
                    <p className="text-xs text-slate-500 mt-1">Add variations like different colors, sizes, or finishes</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setHasVariants(!hasVariants);
                      if (!hasVariants && variants.length === 0) {
                        addVariant();
                      }
                    }}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${hasVariants ? 'bg-slate-900' : 'bg-slate-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${hasVariants ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                {/* Variants List */}
                {hasVariants && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-slate-700">Variant Combinations</label>
                      <span className="text-xs text-slate-500">{variants.length} variant{variants.length !== 1 ? 's' : ''}</span>
                    </div>

                    {variants.length === 0 ? (
                      <div className="text-center py-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                        <p className="text-sm text-slate-500 mb-3">No variants added yet</p>
                        <button type="button" onClick={addVariant} className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
                          Add First Variant
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {variants.map((variant, index) => (
                          <div key={variant.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-medium text-slate-700">Variant {index + 1}</span>
                              <button type="button" onClick={() => removeVariant(variant.id)} className="text-red-600 hover:text-red-700 text-sm font-medium">Remove</button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Color</label>
                                <select value={variant.color} onChange={(e) => updateVariant(variant.id, 'color', e.target.value)} className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all">
                                  <option value="">Select color</option>
                                  {Object.keys(colorMapping).map((color) => (
                                    <option key={color} value={color}>
                                      {color.charAt(0).toUpperCase() + color.slice(1)}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Product ID</label>
                                <input type="text" value={variant.productId || ''} onChange={(e) => updateVariant(variant.id, 'productId', e.target.value)} placeholder="SKU-001" className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Size</label>
                                <input type="text" value={variant.size} onChange={(e) => updateVariant(variant.id, 'size', e.target.value)} placeholder="24x24, 12x12..." className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Finish</label>
                                <select value={variant.finish} onChange={(e) => updateVariant(variant.id, 'finish', e.target.value)} className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all">
                                  <option value="">Select finish</option>
                                  {FINISH_TYPES.map((finish) => (
                                    <option key={finish} value={finish}>{finish}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Price (₹)</label>
                                <input type="number" value={variant.price} onChange={(e) => updateVariant(variant.id, 'price', e.target.value)} placeholder="999" className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Stock</label>
                                <input type="number" value={variant.stock} onChange={(e) => updateVariant(variant.id, 'stock', e.target.value)} placeholder="100" className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
                              </div>
                            </div>
                          </div>
                        ))}
                        <button type="button" onClick={addVariant} className="w-full py-3 px-4 border-2 border-dashed border-slate-300 text-slate-600 rounded-xl hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 group">
                          <FiPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          <span className="text-sm font-medium">Add Another Variant</span>
                        </button>

                        {/* Helpful Note */}
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-xs text-blue-800 leading-relaxed">
                            <strong>💡 Tip:</strong> Each variant should have at least one unique attribute (Color, Size, or Finish).
                            For example: If you have different colors, fill in the Color field for each variant.
                            If you have different sizes, fill in the Size field. You can leave other fields empty if not applicable.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* 6. Product Tags */}
          <AccordionItem value="tags" className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <AccordionTrigger className="px-8 py-6 hover:no-underline hover:bg-slate-50 transition-colors">
              <h2 className="text-xl font-medium text-slate-900">6. Product Tags</h2>
            </AccordionTrigger>
            <AccordionContent className="px-8 pb-8">
              <div className="pt-4">
                <label className="block text-sm font-medium text-slate-700 mb-4">
                  Select tags to display on product cards
                </label>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Popular */}
                  <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-blue-50 hover:border-blue-300 transition-all cursor-pointer group">
                    <input type="checkbox" name="tags" value="popular" defaultChecked={product.tags?.includes('popular')} className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer" />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">⭐ Popular</span>
                  </label>

                  {/* Trending */}
                  <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-yellow-50 hover:border-yellow-300 transition-all cursor-pointer group">
                    <input type="checkbox" name="tags" value="trending" defaultChecked={product.tags?.includes('trending')} className="w-4 h-4 text-yellow-600 bg-white border-slate-300 rounded focus:ring-2 focus:ring-yellow-500 cursor-pointer" />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-yellow-700">🔥 Trending</span>
                  </label>

                  {/* New */}
                  <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-green-50 hover:border-green-300 transition-all cursor-pointer group">
                    <input type="checkbox" name="tags" value="new" defaultChecked={product.tags?.includes('new')} className="w-4 h-4 text-green-600 bg-white border-slate-300 rounded focus:ring-2 focus:ring-green-500 cursor-pointer" />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-green-700">✨ New</span>
                  </label>

                  {/* Premium */}
                  <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-purple-50 hover:border-purple-300 transition-all cursor-pointer group">
                    <input type="checkbox" name="tags" value="premium" defaultChecked={product.tags?.includes('premium')} className="w-4 h-4 text-purple-600 bg-white border-slate-300 rounded focus:ring-2 focus:ring-purple-500 cursor-pointer" />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-purple-700">💎 Premium</span>
                  </label>

                  {/* Exclusive */}
                  <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-pink-50 hover:border-pink-300 transition-all cursor-pointer group">
                    <input type="checkbox" name="tags" value="exclusive" defaultChecked={product.tags?.includes('exclusive')} className="w-4 h-4 text-pink-600 bg-white border-slate-300 rounded focus:ring-2 focus:ring-pink-500 cursor-pointer" />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-pink-700">👑 Exclusive</span>
                  </label>

                  {/* Classic */}
                  <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 hover:border-slate-400 transition-all cursor-pointer group">
                    <input type="checkbox" name="tags" value="classic" defaultChecked={product.tags?.includes('classic')} className="w-4 h-4 text-slate-600 bg-white border-slate-300 rounded focus:ring-2 focus:ring-slate-500 cursor-pointer" />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">🏛️ Classic</span>
                  </label>

                  {/* Best Seller */}
                  <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-orange-50 hover:border-orange-300 transition-all cursor-pointer group">
                    <input type="checkbox" name="tags" value="bestseller" defaultChecked={product.tags?.includes('bestseller')} className="w-4 h-4 text-orange-600 bg-white border-slate-300 rounded focus:ring-2 focus:ring-orange-500 cursor-pointer" />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-orange-700">🏆 Best Seller</span>
                  </label>

                  {/* Limited Edition */}
                  <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-red-50 hover:border-red-300 transition-all cursor-pointer group">
                    <input type="checkbox" name="tags" value="limited" defaultChecked={product.tags?.includes('limited')} className="w-4 h-4 text-red-600 bg-white border-slate-300 rounded focus:ring-2 focus:ring-red-500 cursor-pointer" />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-red-700">⏰ Limited Edition</span>
                  </label>
                </div>

                <p className="text-xs text-slate-500 mt-4">
                  Selected tags will appear as badges on the product card for better visibility
                </p>

                {/* Applications Section */}
                <div className="mt-8 pt-8 border-t border-slate-200">
                  <label className="block text-sm font-medium text-slate-700 mb-4">
                    Applications (Room Types)
                  </label>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Kitchen */}
                    <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-amber-50 hover:border-amber-300 transition-all cursor-pointer group">
                      <input type="checkbox" name="tags" value="kitchen" defaultChecked={product.tags?.includes('kitchen')} className="w-4 h-4 text-amber-600 bg-white border-slate-300 rounded focus:ring-2 focus:ring-amber-500 cursor-pointer" />
                      <span className="text-sm font-medium text-slate-700 group-hover:text-amber-700">🍳 Kitchen</span>
                    </label>

                    {/* Bathroom */}
                    <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-cyan-50 hover:border-cyan-300 transition-all cursor-pointer group">
                      <input type="checkbox" name="tags" value="bathroom" defaultChecked={product.tags?.includes('bathroom')} className="w-4 h-4 text-cyan-600 bg-white border-slate-300 rounded focus:ring-2 focus:ring-cyan-500 cursor-pointer" />
                      <span className="text-sm font-medium text-slate-700 group-hover:text-cyan-700">🚿 Bathroom</span>
                    </label>

                    {/* Living Room */}
                    <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all cursor-pointer group">
                      <input type="checkbox" name="tags" value="living-room" defaultChecked={product.tags?.includes('living-room')} className="w-4 h-4 text-indigo-600 bg-white border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer" />
                      <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-700">🛋️ Living Room</span>
                    </label>

                    {/* Bedroom */}
                    <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-violet-50 hover:border-violet-300 transition-all cursor-pointer group">
                      <input type="checkbox" name="tags" value="bedroom" defaultChecked={product.tags?.includes('bedroom')} className="w-4 h-4 text-violet-600 bg-white border-slate-300 rounded focus:ring-2 focus:ring-violet-500 cursor-pointer" />
                      <span className="text-sm font-medium text-slate-700 group-hover:text-violet-700">🛏️ Bedroom</span>
                    </label>

                    {/* Outdoor */}
                    <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all cursor-pointer group">
                      <input type="checkbox" name="tags" value="outdoor" defaultChecked={product.tags?.includes('outdoor')} className="w-4 h-4 text-emerald-600 bg-white border-slate-300 rounded focus:ring-2 focus:ring-emerald-500 cursor-pointer" />
                      <span className="text-sm font-medium text-slate-700 group-hover:text-emerald-700">🌳 Outdoor</span>
                    </label>

                    {/* Commercial */}
                    <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-gray-50 hover:border-gray-400 transition-all cursor-pointer group">
                      <input type="checkbox" name="tags" value="commercial" defaultChecked={product.tags?.includes('commercial')} className="w-4 h-4 text-gray-600 bg-white border-slate-300 rounded focus:ring-2 focus:ring-gray-500 cursor-pointer" />
                      <span className="text-sm font-medium text-slate-700 group-hover:text-gray-900">🏢 Commercial</span>
                    </label>
                  </div>

                  <p className="text-xs text-slate-500 mt-4">
                    Select room types where this product can be used
                  </p>
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