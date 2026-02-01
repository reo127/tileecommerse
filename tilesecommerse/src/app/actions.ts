"use server";

import { revalidatePath } from "next/cache";
import type { ProductCategory } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1';

// Helper function to transform backend product to frontend format
function transformProduct(backendProduct: any) {
  // Get the featured image or first image
  const featuredImage = backendProduct.images?.find((img: any) => img.isFeatured);
  const mainImage = featuredImage || backendProduct.images?.[0];

  // Transform variants - use real variants if available, otherwise create default
  let variants = [];
  if (backendProduct.hasVariants && backendProduct.variants && backendProduct.variants.length > 0) {
    variants = backendProduct.variants.map((variant: any) => ({
      color: variant.color || backendProduct.color || 'Default',
      size: variant.size || (backendProduct.dimensions ?
        `${backendProduct.dimensions.length}x${backendProduct.dimensions.width} ${backendProduct.dimensions.unit}` :
        ''),
      sizes: variant.size ? [variant.size] : (backendProduct.dimensions ?
        [`${backendProduct.dimensions.length}x${backendProduct.dimensions.width} ${backendProduct.dimensions.unit}`] :
        []),
      finish: variant.finish || backendProduct.finish,
      price: variant.price || backendProduct.price,
      stock: variant.stock || backendProduct.stock,
      images: backendProduct.images || []
    }));
  } else {
    // Create default variant from product data
    variants = [{
      color: backendProduct.color || 'Default',
      size: backendProduct.dimensions ?
        `${backendProduct.dimensions.length}x${backendProduct.dimensions.width} ${backendProduct.dimensions.unit}` :
        '',
      sizes: backendProduct.dimensions ?
        [`${backendProduct.dimensions.length}x${backendProduct.dimensions.width} ${backendProduct.dimensions.unit}`] :
        [],
      finish: backendProduct.finish,
      price: backendProduct.price,
      stock: backendProduct.stock,
      images: backendProduct.images || []
    }];
  }

  return {
    id: backendProduct._id,
    name: backendProduct.name,
    description: backendProduct.description,
    shortDescription: backendProduct.shortDescription,
    price: backendProduct.price,
    cuttedPrice: backendProduct.cuttedPrice,
    category: backendProduct.category?.slug || backendProduct.category,
    categoryName: backendProduct.category?.name || backendProduct.category,
    subcategory: backendProduct.subcategory?.slug || backendProduct.subcategory,
    subcategoryName: backendProduct.subcategory?.name,
    img: mainImage?.url || '/placeholder.jpg',
    images: backendProduct.images || [],
    brand: backendProduct.brand,
    stock: backendProduct.stock,
    warranty: backendProduct.warranty,
    ratings: backendProduct.ratings || 0,
    numOfReviews: backendProduct.numOfReviews || 0,
    // Tiles-specific fields
    material: backendProduct.material,
    finish: backendProduct.finish,
    color: backendProduct.color,
    dimensions: backendProduct.dimensions,
    roomType: backendProduct.roomType,
    thickness: backendProduct.thickness,
    coverage: backendProduct.coverage,
    tilesPerBox: backendProduct.tilesPerBox,
    weight: backendProduct.weight,
    waterAbsorption: backendProduct.waterAbsorption,
    slipResistance: backendProduct.slipResistance,
    highlights: backendProduct.highlights || [],
    specifications: backendProduct.specifications || [],
    tags: backendProduct.tags || [],
    hasVariants: backendProduct.hasVariants || false,
    variants: variants
  };
}

// Fetch products from backend API

export async function getAllProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/products/all`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      console.error('Failed to fetch products:', response.statusText);
      return [];
    }

    const data = await response.json();
    const products = data.success ? data.products : [];
    return products.map(transformProduct);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getCategoryProducts(category: ProductCategory) {
  try {
    const response = await fetch(`${API_BASE_URL}/products?category=${category}`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      console.error('Failed to fetch category products:', response.statusText);
      return [];
    }

    const data = await response.json();
    const products = data.success ? data.products : [];
    return products.map(transformProduct);
  } catch (error) {
    console.error('Error fetching category products:', error);
    return [];
  }
}

export async function getProduct(productId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/product/${productId}`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      console.error('Failed to fetch product:', response.statusText);
      return null;
    }

    const data = await response.json();
    return data.success ? transformProduct(data.product) : null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function getRandomProducts(limit: number = 4) {
  try {
    const allProducts = await getAllProducts();
    const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
  } catch (error) {
    console.error('Error fetching random products:', error);
    return [];
  }
}

export async function searchProducts(query: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/products?keyword=${encodeURIComponent(query)}`, {
      next: { revalidate: 30 }, // Cache search results for 30 seconds
    });

    if (!response.ok) {
      console.error('Failed to search products:', response.statusText);
      return [];
    }

    const data = await response.json();
    const products = data.success ? data.products : [];
    return products.map(transformProduct);
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
}

export async function revalidateProducts(productId?: string) {
  // Revalidate the homepage and product pages
  revalidatePath('/');
  if (productId) {
    revalidatePath(`/product/${productId}`);
  }
  return { success: true };
}
