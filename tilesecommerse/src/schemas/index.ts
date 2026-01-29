import { z } from "zod";

// Mock schemas for frontend-only app
export const ProductWithVariantsSchema = z.any();
export const CartItemSchema = z.any();
export const OrderWithDetailsSchema = z.any();
export const InsertOrderItemSchema = z.any();
export const InsertCustomerInfoSchema = z.any();
export const InsertOrderProductSchema = z.any();
export const ProductCategoryZod = z.enum(["living-room", "kitchen", "bathroom", "outdoor", "floor-tiles", "wall-tiles", "bathroom-tiles", "kitchen-tiles", "outdoor-tiles"]);
export const ProductSizeEnum = z.enum(["12x12", "12x24", "16x16", "18x18", "24x24", "32x32"]);
export const WishlistItemSchema = z.any();

export type ProductWithVariants = any;
export type ProductVariant = any;
export type Product = any;
export type CartItem = any;
export type ProductSize = string;
export type ProductCategory = string;
export type OrderItem = any;
export type CustomerInfo = any;
export type OrderProduct = any;
export type ProductFormData = any;
export type WishlistItem = any;
export type OrderProductWithDetails = any;
export type OrderWithDetails = any;
export type Address = any;
