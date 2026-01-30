"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FiUpload, FiCheck, FiX, FiStar, FiTrash2, FiImage } from "react-icons/fi";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export function SimpleProductForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadProgress, setUploadProgress] = useState('');
  const [imagePreviews, setImagePreviews] = useState<Array<{ file: File; preview: string; id: string }>>([]);
  const [featuredImageIndex, setFeaturedImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleImageSelect = (files: FileList | null) => {
    if (!files) return;

    const newImages = Array.from(files).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
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
      // Adjust featured index if needed
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

    // Validate images
    if (imagePreviews.length === 0) {
      setError('Please upload at least one product image');
      return;
    }

    setLoading(true);
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
      const material = formData.get('material') as string;
      const finish = formData.get('finish') as string;
      const color = formData.get('color') as string;
      const length = formData.get('length') as string;
      const width = formData.get('width') as string;
      const unit = formData.get('unit') as string;
      const thickness = formData.get('thickness') as string;
      const coverage = formData.get('coverage') as string;
      const tilesPerBox = formData.get('tilesPerBox') as string;
      const weight = formData.get('weight') as string;
      const waterAbsorption = formData.get('waterAbsorption') as string;
      const slipResistance = formData.get('slipResistance') as string;

      const roomType = formData.getAll('roomType') as string[];
      const highlight1 = formData.get('highlight1') as string;
      const highlight2 = formData.get('highlight2') as string;
      const highlight3 = formData.get('highlight3') as string;
      const highlights = [highlight1, highlight2, highlight3].filter(h => h);

      const specTitle1 = formData.get('specTitle1') as string;
      const specDesc1 = formData.get('specDesc1') as string;
      const specTitle2 = formData.get('specTitle2') as string;
      const specDesc2 = formData.get('specDesc2') as string;
      const specifications = [];
      if (specTitle1 && specDesc1) specifications.push(JSON.stringify({ title: specTitle1, description: specDesc1 }));
      if (specTitle2 && specDesc2) specifications.push(JSON.stringify({ title: specTitle2, description: specDesc2 }));

      setUploadProgress('Processing images...');
      const images = [];
      for (let i = 0; i < imagePreviews.length; i++) {
        setUploadProgress(`Processing image ${i + 1} of ${imagePreviews.length}...`);
        const base64 = await fileToBase64(imagePreviews[i].file);
        images.push(base64);
      }

      setUploadProgress('Processing brand logo...');
      const logoFile = formData.get('logo') as File;
      let logo = '';
      if (logoFile && logoFile.size > 0) {
        logo = await fileToBase64(logoFile);
      }

      // Build dimensions object only if length or width is provided
      const dimensionsObj: any = { unit };
      if (length) dimensionsObj.length = Number(length);
      if (width) dimensionsObj.width = Number(width);

      const requestBody: any = {
        name,
        description,
        price: Number(price),
        cuttedPrice: Number(cuttedPrice),
        category,
        brandname,
        logo,
        images,
        highlights,
        specifications,
        stock: Number(stock),
        warranty: Number(warranty),
      };

      // Only add optional fields if they have values
      if (material) requestBody.material = material;
      if (finish) requestBody.finish = finish;
      if (color) requestBody.color = color;
      if (length || width) requestBody.dimensions = JSON.stringify(dimensionsObj);
      if (roomType.length > 0) requestBody.roomType = JSON.stringify(roomType);
      if (thickness) requestBody.thickness = Number(thickness);
      if (coverage) requestBody.coverage = Number(coverage);
      if (tilesPerBox) requestBody.tilesPerBox = Number(tilesPerBox);
      if (weight) requestBody.weight = Number(weight);
      if (waterAbsorption) requestBody.waterAbsorption = waterAbsorption;
      if (slipResistance) requestBody.slipResistance = slipResistance;

      setUploadProgress('Uploading to server...');
      const token = localStorage.getItem('auth_token');

      const response = await fetch(`${API_BASE_URL}/admin/product/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message || 'Error creating product');
        setUploadProgress('');
        return;
      }

      setSuccess('Product created successfully! You can create another product or go to the products page.');
      setUploadProgress('');
      // Reset form after success
      (e.target as HTMLFormElement).reset();

    } catch (err) {
      console.error('Error:', err);
      setError('An unexpected error occurred');
      setUploadProgress('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-light text-slate-900 mb-3 tracking-tight">Create New Product</h1>
          <p className="text-slate-500 text-lg font-light">Add a premium tile to your collection</p>
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
                    placeholder="Elegant marble tiles with luxurious finish..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Price (₹)</label>
                  <input
                    name="price"
                    type="number"
                    required
                    placeholder="999"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">MRP (₹)</label>
                  <input
                    name="cuttedPrice"
                    type="number"
                    required
                    placeholder="1499"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                  <select
                    name="category"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                  >
                    <option value="">Select category</option>
                    <option value="floor-tiles">Floor Tiles</option>
                    <option value="wall-tiles">Wall Tiles</option>
                    <option value="bathroom-tiles">Bathroom Tiles</option>
                    <option value="kitchen-tiles">Kitchen Tiles</option>
                    <option value="outdoor-tiles">Outdoor Tiles</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Stock</label>
                  <input
                    name="stock"
                    type="number"
                    required
                    defaultValue="100"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Brand Name</label>
                  <input
                    name="brandname"
                    required
                    placeholder="Premium Tiles Co."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Warranty (years)</label>
                  <input
                    name="warranty"
                    type="number"
                    required
                    defaultValue="5"
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
                            {/* Image */}
                            <div className="aspect-square bg-slate-100">
                              <img
                                src={image.preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Featured Badge */}
                            {index === featuredImageIndex && (
                              <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                                <FiStar className="w-3 h-3 fill-current" />
                                Featured
                              </div>
                            )}

                            {/* Action Buttons */}
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

                            {/* Image Number */}
                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs font-medium">
                              {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {imagePreviews.length === 0 && (
                    <p className="text-xs text-red-500 mt-2">* At least one product image is required</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Brand Logo</label>
                  <input
                    name="logo"
                    type="file"
                    accept="image/*"
                    required
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-slate-900 file:text-white file:text-sm hover:file:bg-slate-800"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* 3. Tile Specifications */}
          <AccordionItem value="specs" className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <AccordionTrigger className="px-8 py-6 hover:no-underline hover:bg-slate-50 transition-colors">
              <h2 className="text-xl font-medium text-slate-900">3. Tile Specifications</h2>
            </AccordionTrigger>
            <AccordionContent className="px-8 pb-8">
              <div className="grid md:grid-cols-2 gap-6 pt-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Material</label>
                  <select name="material" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all">
                    <option value="">Select material</option>
                    <option value="ceramic">Ceramic</option>
                    <option value="porcelain">Porcelain</option>
                    <option value="marble">Marble</option>
                    <option value="vitrified">Vitrified</option>
                    <option value="granite">Granite</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Finish</label>
                  <select name="finish" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all">
                    <option value="">Select finish</option>
                    <option value="glossy">Glossy</option>
                    <option value="matte">Matte</option>
                    <option value="polished">Polished</option>
                    <option value="anti-skid">Anti-Skid</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Color</label>
                  <input name="color" placeholder="White, Beige, Gray..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Length</label>
                  <input name="length" type="number" placeholder="24" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Width</label>
                  <input name="width" type="number" placeholder="24" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Unit</label>
                  <select name="unit" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all">
                    <option value="inches">Inches</option>
                    <option value="cm">CM</option>
                    <option value="mm">MM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Thickness (mm)</label>
                  <input name="thickness" type="number" placeholder="8" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Coverage (sq ft/box)</label>
                  <input name="coverage" type="number" placeholder="20" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Tiles per Box</label>
                  <input name="tilesPerBox" type="number" placeholder="4" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Weight (kg/box)</label>
                  <input name="weight" type="number" placeholder="25" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Slip Resistance</label>
                  <select name="slipResistance" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all">
                    <option value="">Select rating</option>
                    <option value="R9">R9</option>
                    <option value="R10">R10</option>
                    <option value="R11">R11</option>
                    <option value="R12">R12</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Water Absorption</label>
                  <input name="waterAbsorption" placeholder="<0.5%, 0.5-3%" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-3">Room Type</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {['Bathroom', 'Kitchen', 'Living Room', 'Bedroom', 'Outdoor', 'Floor', 'Wall', 'Commercial'].map((room) => (
                      <label key={room} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors">
                        <input type="checkbox" name="roomType" value={room.toLowerCase().replace(' ', '-')} className="w-4 h-4 text-slate-900 rounded focus:ring-2 focus:ring-slate-900" />
                        <span className="text-sm text-slate-700">{room}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* 4. Highlights & Details */}
          <AccordionItem value="highlights" className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <AccordionTrigger className="px-8 py-6 hover:no-underline hover:bg-slate-50 transition-colors">
              <h2 className="text-xl font-medium text-slate-900">4. Highlights & Details</h2>
            </AccordionTrigger>
            <AccordionContent className="px-8 pb-8">
              <div className="space-y-6 pt-4">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-700">Product Highlights</label>
                  <input name="highlight1" placeholder="Highlight 1" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
                  <input name="highlight2" placeholder="Highlight 2" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
                  <input name="highlight3" placeholder="Highlight 3" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
                </div>

                <div className="pt-4">
                  <label className="block text-sm font-medium text-slate-700 mb-3">Technical Specifications</label>
                  <div className="grid md:grid-cols-2 gap-4 mb-3">
                    <input name="specTitle1" placeholder="Spec Title 1" className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
                    <input name="specDesc1" placeholder="Spec Description 1" className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input name="specTitle2" placeholder="Spec Title 2" className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
                    <input name="specDesc2" placeholder="Spec Description 2" className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="flex-1 py-4 px-6 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl hover:bg-slate-50 transition-all duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-4 px-6 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                <span>Create Product</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

