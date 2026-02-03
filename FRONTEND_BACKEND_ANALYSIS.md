# Frontend-Backend Integration Analysis

## 📊 **Current Setup Overview**

### **Backend (Port 4000)**
- **Location**: `d:\tileecommerse\backend`
- **Running**: `npm start` on `http://localhost:4000`
- **API Base**: `/api/v1`

### **Frontend (Port 3000)**
- **Location**: `d:\tileecommerse\tilesecommerse`
- **Running**: `npm run dev` on `http://localhost:3000`
- **Framework**: Next.js 14+ (App Router)

---

## 🔗 **API Connection Configuration**

### **Environment Variables** (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_API_VERSION=v1
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_ENV=development
```

### **API Utility** (`src/lib/utils/api.ts`)
```typescript
export const getApiUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1';
  return url.replace(/\/+$/, ''); // Remove trailing slashes
};
```

---

## 📂 **Category System Structure**

### **Backend**

#### **Model** (`backend/models/categoryModel.js`)
- Parent-child hierarchy (max 2 levels)
- Fields: name, slug, description, parent, level, order, productCount, isActive
- Auto-generates slug from name
- Validates parent-child relationships

#### **Routes** (`backend/routes/categoryRoute.js`)
```javascript
// Public routes
GET  /api/v1/categories          → getActiveCategories()
GET  /api/v1/category/:id        → getCategory()

// Admin routes (requires auth)
GET    /api/v1/admin/categories  → getAllCategories()
POST   /api/v1/admin/categories  → createCategory()
PUT    /api/v1/admin/category/:id → updateCategory()
DELETE /api/v1/admin/category/:id → deleteCategory()
PATCH  /api/v1/admin/category/:id/toggle → toggleCategoryStatus()
PATCH  /api/v1/admin/categories/reorder → reorderCategories()
```

#### **Controller** (`backend/controllers/categoryController.js`)
- Creates categories with auto-slug generation
- Returns category tree structure
- Validates parent-child relationships
- Prevents duplicate names

---

### **Frontend**

#### **Schema** (`src/schemas/index.ts`)
```typescript
export const CategorySchema = z.object({
  _id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  parent: z.string().nullable().optional(),
  level: z.number().default(0),
  order: z.number().default(0),
  productCount: z.number().default(0),
  isActive: z.boolean().default(true),
  createdBy: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  children: z.array(z.any()).optional(),
});

export type Category = z.infer<typeof CategorySchema>;
```

#### **Hook** (`src/hooks/category/queries/useCategories.ts`)
```typescript
export const useCategories = (includeInactive = false) => {
  // Fetches from /api/v1/categories (public)
  // OR /api/v1/admin/categories (admin with auth)
  
  return {
    categories: Category[],  // Array of categories
    count: number,
    isLoading: boolean,
    isError: boolean,
    error: Error | null,
    // ... other react-query properties
  };
};
```

#### **Usage in Product Form** (`src/components/admin/BasicInfo.tsx`)
```typescript
const { categories, isLoading: categoriesLoading } = useCategories();

// categories is Category[] - array of parent categories with children
// Each parent category has a 'children' array of subcategories
```

---

## 🐛 **Current Issue**

### **Problem**
Categories created in backend are not showing in product form dropdown.

### **Root Cause Analysis**

1. ✅ **Backend is running** - Port 4000
2. ✅ **Categories exist** - Created via admin panel
3. ✅ **API endpoint exists** - `/api/v1/categories`
4. ✅ **Hook is correct** - `useCategories()` from queries folder
5. ✅ **Import is fixed** - Using correct hook path
6. ❌ **TypeScript errors** - Type mismatches preventing compilation

### **TypeScript Errors**
```
- categories.length not recognized (thinks it's CategoriesResponse not Category[])
- categories.map() not recognized
- parentCategory and childCategory have 'any' type
```

---

## ✅ **Solution Steps**

### **1. Fix TypeScript Types**

The hook returns:
```typescript
{
  categories: Category[],  // This is the array
  count: number,
  isLoading: boolean,
  ...otherReactQueryProps
}
```

Usage should be:
```typescript
const { categories, isLoading } = useCategories();
// categories is already Category[], not CategoriesResponse
```

### **2. Add Type Assertions**

In `BasicInfo.tsx`, add explicit types:
```typescript
import type { Category } from "@/schemas";

// In the map function:
categories.map((parentCategory: Category) => (
  // ...
  parentCategory.children?.map((childCategory: Category) => (
    // ...
  ))
))
```

### **3. Test the Flow**

1. Open browser console (F12)
2. Navigate to product creation form
3. Look for network request to `/api/v1/categories`
4. Check response data structure
5. Verify dropdown populates

---

## 📝 **Expected Data Flow**

```
1. User opens Product Form
   ↓
2. BasicInfo component mounts
   ↓
3. useCategories() hook executes
   ↓
4. Fetches GET http://localhost:4000/api/v1/categories
   ↓
5. Backend returns:
   {
     success: true,
     count: 3,
     categories: [
       {
         _id: "...",
         name: "Tiles",
         slug: "tiles",
         level: 0,
         children: [
           { _id: "...", name: "Wall Tiles", slug: "wall-tiles", level: 1 },
           { _id: "...", name: "Floor Tiles", slug: "floor-tiles", level: 1 }
         ]
       },
       {
         _id: "...",
         name: "Fittings",
         slug: "fittings",
         level: 0,
         children: [...]
       }
     ]
   }
   ↓
6. Hook extracts categories array
   ↓
7. Component renders dropdown with hierarchy:
   - Tiles (parent)
     - Wall Tiles (child, indented)
     - Floor Tiles (child, indented)
   - Fittings (parent)
     - CP Fittings (child, indented)
```

---

## 🔧 **Quick Fix**

Replace the category mapping section in `BasicInfo.tsx` (lines 149-174) with:

```typescript
<SelectContent>
  {categoriesLoading ? (
    <SelectItem value="" disabled>Loading categories...</SelectItem>
  ) : Array.isArray(categories) && categories.length > 0 ? (
    categories.map((parent) => (
      <SelectGroup key={parent._id}>
        <SelectLabel>{parent.name}</SelectLabel>
        <SelectItem value={parent.slug}>{parent.name}</SelectItem>
        {parent.children?.map((child) => (
          <SelectItem key={child._id} value={child.slug} className="pl-6">
            {child.name}
          </SelectItem>
        ))}
      </SelectGroup>
    ))
  ) : (
    <SelectItem value="" disabled>No categories available</SelectItem>
  )}
</SelectContent>
```

---

## 🎯 **Next Steps**

1. Fix TypeScript errors in BasicInfo.tsx
2. Test category fetching in browser console
3. Verify dropdown shows backend categories
4. Create category management UI for admins
