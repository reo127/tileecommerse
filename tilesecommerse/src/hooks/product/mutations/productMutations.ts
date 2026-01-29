import type { ProductApiResponse } from "@/types/admin";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1';

// Helper function to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export async function createProduct(
  formData: FormData
): Promise<ProductApiResponse> {
  try {
    const token = localStorage.getItem('auth_token');

    const response = await fetch(`${API_BASE_URL}/admin/product/new`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Error creating product",
      };
    }

    return {
      success: true,
      message: "Product created successfully",
      data: result.product,
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, message: "Unexpected error creating product" };
  }
}

export async function updateProduct(
  formData: FormData
): Promise<ProductApiResponse> {
  try {
    const token = localStorage.getItem('auth_token');
    const productId = formData.get('id');

    const response = await fetch(`${API_BASE_URL}/admin/product/${productId}`, {
      method: "PUT",
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Error updating product",
      };
    }

    return {
      success: true,
      message: "Product updated successfully",
      data: result.product,
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, message: "Unexpected error updating product" };
  }
}

export async function deleteProduct(productId: string): Promise<boolean> {
  try {
    const token = localStorage.getItem('auth_token');

    const response = await fetch(`${API_BASE_URL}/admin/product/${productId}`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });

    return response.ok;
  } catch (error) {
    console.error("Error deleting product:", error);
    return false;
  }
}
