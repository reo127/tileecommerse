"use server";

import { getApiUrl } from "@/lib/utils/api";
import { OrderWithDetails } from "@/schemas";
import { cookies } from "next/headers";

export const getOrder = async (
  orderId: string
): Promise<OrderWithDetails | null> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      console.info("No auth token found, cannot fetch order");
      return null;
    }

    const response = await fetch(`${getApiUrl()}/order/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      console.error(`Failed to fetch order ${orderId}, status: ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (data.success && data.order) {
      // The backend response needs to be transformed to match the frontend's OrderWithDetails schema
      // This is a temporary transformation and might need adjustments based on the actual schemas
      const order = data.order;
      return {
        id: order._id,
        orderNumber: order._id.slice(-8).toUpperCase(), // Or a real order number if available
        userId: order.user.id,
        user: {
          id: order.user.id,
          name: order.user.name,
          email: order.user.email,
        },
        customerInfo: {
          id: order._id, // Placeholder
          orderId: order._id,
          name: order.shippingInfo.name || order.user.name,
          email: order.user.email,
          phone: order.shippingInfo.phoneNo.toString(),
          address: {
            line1: order.shippingInfo.address,
            city: order.shippingInfo.city,
            state: order.shippingInfo.state,
            postal_code: order.shippingInfo.pincode.toString(),
            country: order.shippingInfo.country,
          },
          totalPrice: order.totalPrice,
        },
        orderProducts: order.orderItems.map((item: any) => ({
          id: item._id,
          orderId: order._id,
          variantId: item.product, // Assuming product ID is the variant ID
          quantity: item.quantity,
          size: "600x600", // Placeholder, as size is not in the backend model
          variant: {
            id: item.product,
            productId: item.product,
            color: "Default", // Placeholder
            stripeId: "stripe_id_placeholder", // Placeholder
            images: [{ id: 1, url: item.image, alt: item.name }],
            product: {
              id: item.product,
              name: item.name,
              description: "Product description placeholder", // Placeholder
              price: item.price,
              stripeId: "stripe_id_placeholder", // Placeholder
              category: "uncategorized", // Placeholder
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          },
        })),
        deliveryDate: new Date(order.deliveredAt || order.createdAt).toISOString(),
        createdAt: new Date(order.createdAt).toISOString(),
        updatedAt: new Date(order.updatedAt || order.createdAt).toISOString(),
      };
    }

    return null;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    console.error("Error fetching order:", errorMessage);
    return null;
  }
};

export const getUserOrders = async (): Promise<OrderWithDetails[] | null> => {
  // This function is not used by the order details page, 
  // but it's good practice to have it here.
  // The actual implementation is in the OrdersList component for now.
  return [];
};