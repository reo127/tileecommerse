# 📊 Tiles E-Commerce - Complete Project Analysis

**Analysis Date:** 2026-01-30  
**Project:** SLN TILES SHOWROOM  
**Stack:** MERN (MongoDB, Express, React/Next.js, Node.js)

---

## 🏗️ **Architecture Overview**

### **Technology Stack**

#### **Backend:**
- **Framework:** Node.js + Express.js
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens) + HTTP-only cookies
- **File Upload:** Cloudinary (images)
- **Payment:** Stripe + Paytm integration
- **Email:** SendGrid (password reset, order confirmations)
- **Security:** bcryptjs (password hashing), CORS enabled

#### **Frontend:**
- **Framework:** Next.js 16.1.1 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI + shadcn/ui
- **State Management:** React Query (@tanstack/react-query)
- **Forms:** Zod validation
- **Icons:** React Icons
- **Carousel:** Embla Carousel
- **Search:** Fuse.js (fuzzy search)
- **Notifications:** Sonner (toast notifications)

---

## 📁 **Project Structure**

```
tileecommerse/
├── backend/                    # Node.js/Express API
│   ├── config/
│   │   ├── config.env         # Environment variables
│   │   └── database.js        # MongoDB connection
│   ├── controllers/           # Business logic
│   │   ├── userController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   └── paymentController.js
│   ├── models/                # MongoDB schemas
│   │   ├── userModel.js
│   │   ├── productModel.js
│   │   ├── orderModel.js
│   │   ├── categoryModel.js
│   │   └── paymentModel.js
│   ├── routes/                # API endpoints
│   │   ├── userRoute.js
│   │   ├── productRoute.js
│   │   ├── orderRoute.js
│   │   └── paymentRoute.js
│   ├── middlewares/           # Custom middleware
│   │   ├── auth.js           # JWT authentication
│   │   ├── error.js          # Error handling
│   │   └── asyncErrorHandler.js
│   ├── utils/                 # Helper functions
│   ├── server.js             # Entry point
│   └── app.js                # Express configuration
│
└── tilesecommerse/            # Next.js Frontend
    ├── src/
    │   ├── app/               # Next.js App Router
    │   │   ├── (auth)/       # Auth pages (login, register)
    │   │   ├── (user)/       # User pages (cart, orders, wishlist)
    │   │   ├── (store)/      # Store application pages
    │   │   ├── admin/        # Admin dashboard
    │   │   ├── api/          # API routes
    │   │   ├── actions.ts    # Server actions
    │   │   ├── layout.tsx    # Root layout
    │   │   └── page.tsx      # Homepage
    │   ├── components/        # React components
    │   │   ├── admin/        # Admin components
    │   │   ├── cart/         # Cart components
    │   │   ├── checkout/     # Checkout flow
    │   │   ├── home/         # Homepage sections
    │   │   ├── layout/       # Header, Footer, Nav
    │   │   ├── product/      # Product components
    │   │   ├── products/     # Product listing
    │   │   ├── ui/           # Reusable UI components
    │   │   └── ...
    │   ├── lib/              # Utilities
    │   ├── hooks/            # Custom React hooks
    │   ├── types/            # TypeScript types
    │   ├── constants/        # App configuration
    │   ├── services/         # API services
    │   └── styles/           # Global styles
    └── public/               # Static assets
```

---

## 🗄️ **Database Models**

### **1. User Model** (`userModel.js`)

**Fields:**
- `name` - String, required
- `email` - String, unique, validated
- `gender` - Enum: ['male', 'female', 'other']
- `password` - String, hashed with bcrypt, min 8 chars
- `avatar` - Object: { public_id, url } (Cloudinary)
- `role` - Enum: ['user', 'admin', 'superadmin'], default: 'user'

**Embedded Arrays:**
- **Cart:** Product references with quantity, variant (color, size), price
- **Wishlist:** Product references with addedAt timestamp
- **Addresses:** Multiple delivery addresses with:
  - name, phoneNo, address, city, state, country, pincode
  - addressType: ['home', 'work', 'other']
  - isDefault: Boolean
- **Recently Viewed:** Product references with viewedAt timestamp

**Methods:**
- `getJWTToken()` - Generate JWT token
- `comparePassword(password)` - Compare hashed password
- `getResetPasswordToken()` - Generate password reset token

---

### **2. Product Model** (`productModel.js`)

**Core Fields:**
- `name` - String, required
- `description` - String, required
- `price` - Number, required
- `cuttedPrice` - Number (original price for discount display)
- `stock` - Number, max 4 digits, default: 1
- `warranty` - Number (years), default: 1
- `category` - String, required
- `ratings` - Number, default: 0
- `numOfReviews` - Number, default: 0

**Media:**
- `images` - Array of: { public_id, url, isFeatured }
- `brand` - Object: { name, logo: { public_id, url } }

**Tiles-Specific Fields:**
- **Dimensions:** { length, width, unit: ['inches', 'cm', 'mm'] }
- **Material:** Enum: ['ceramic', 'porcelain', 'marble', 'vitrified', 'granite', 'natural-stone', 'glass', 'cement', 'other']
- **Room Type:** Array of: ['bathroom', 'kitchen', 'living-room', 'bedroom', 'outdoor', 'floor', 'wall', 'commercial']
- **Finish:** Enum: ['glossy', 'matte', 'textured', 'polished', 'anti-skid', 'satin', 'rustic']
- **Color:** String
- **Thickness:** Number (mm)
- **Coverage:** Number (sq ft per box)
- **Tiles Per Box:** Number
- **Weight:** Number (kg per box)
- **Water Absorption:** String (e.g., '<0.5%', '0.5-3%', '>10%')
- **Slip Resistance:** Enum: ['R9', 'R10', 'R11', 'R12', 'R13', 'Not Rated']
- **Bulk Pricing:** Array of: { minQty, price }

**Additional:**
- `highlights` - Array of strings
- `specifications` - Array of: { title, description }
- `reviews` - Array of: { user, name, rating, comment }
- `user` - Reference to User (creator)
- `createdAt` - Date

---

### **3. Order Model** (`orderModel.js`)

**Fields:**
- **Shipping Info:** address, city, state, country, pincode, phoneNo
- **Order Items:** Array of:
  - name, price, quantity, image
  - product (reference to Product)
- **User:** Reference to User
- **Payment Info:** { id, status }
- `paidAt` - Date
- `totalPrice` - Number
- `orderStatus` - String, default: 'Processing'
- `deliveredAt` - Date
- `shippedAt` - Date
- `createdAt` - Date

---

### **4. Category Model** (`categoryModel.js`)
- Categories for organizing products

### **5. Payment Model** (`paymentModel.js`)
- Payment transaction records

---

## 🔌 **Backend API Endpoints**

### **Base URL:** `http://localhost:4000/api/v1`

### **Authentication Routes** (`/api/v1`)
```
POST   /register              - Register new user
POST   /login                 - Login user
GET    /logout                - Logout user
POST   /password/forgot       - Send password reset email
PUT    /password/reset/:token - Reset password with token
GET    /me                    - Get current user profile
PUT    /password/update       - Update password
PUT    /me/update             - Update user profile
```

### **Product Routes** (`/api/v1`)
```
GET    /products              - Get all products (with filters, search, pagination)
GET    /products/all          - Get all products (no pagination)
GET    /product/:id           - Get single product details
PUT    /review                - Add/update product review (auth required)
```

### **Admin - Product Routes** (`/api/v1/admin`)
```
GET    /admin/products        - Get all products (admin)
POST   /admin/product/new     - Create new product
PUT    /admin/product/:id     - Update product
DELETE /admin/product/:id     - Delete product
GET    /admin/reviews         - Get all reviews
DELETE /admin/reviews         - Delete review
```

### **Order Routes** (`/api/v1`)
```
POST   /order/new             - Create new order (auth required)
GET    /orders/me             - Get my orders (auth required)
GET    /order/:id             - Get single order details (auth required)
```

### **Admin - Order Routes** (`/api/v1/admin`)
```
GET    /admin/orders          - Get all orders
PUT    /admin/order/:id       - Update order status
DELETE /admin/order/:id       - Delete order
```

### **Admin - User Routes** (`/api/v1/admin`)
```
GET    /admin/users           - Get all users
GET    /admin/user/:id        - Get single user
PUT    /admin/user/:id        - Update user role
DELETE /admin/user/:id        - Delete user
```

### **Payment Routes** (`/api/v1`)
```
POST   /payment/process       - Process payment (Stripe/Paytm)
GET    /stripeapikey          - Get Stripe API key
```

---

## 🎨 **Frontend Structure**

### **Page Routes**

#### **Public Pages:**
- `/` - Homepage (Hero, Collections, Featured Products, Testimonials)
- `/products` - All products listing
- `/products/[category]` - Category-specific products
- `/product/[id]` - Product detail page
- `/search` - Search results

#### **Auth Pages:** (`/app/(auth)`)
- `/login` - User login
- `/register` - User registration
- `/forgot-password` - Password reset

#### **User Pages:** (`/app/(user)`)
- `/cart` - Shopping cart
- `/wishlist` - Wishlist
- `/checkout` - Checkout flow
- `/orders` - Order history
- `/orders/[id]` - Order details
- `/result` - Payment result

#### **Admin Pages:** (`/app/admin`)
- `/admin` - Dashboard (stats, charts)
- `/admin/products` - Product management
- `/admin/products/new` - Add new product
- `/admin/products/[id]` - Edit product
- `/admin/orders` - Order management
- `/admin/customers` - Customer management
- `/admin/coupons` - Coupon management
- `/admin/blogs` - Blog management
- `/admin/settings` - App settings

#### **Store Application:** (`/app/(store)`)
- Store owner application pages

---

## 🎯 **Key Features**

### **✅ Implemented Features**

#### **User Features:**
1. **Authentication:**
   - User registration with email validation
   - Login/logout with JWT
   - Password reset via email
   - Profile management
   - Avatar upload (Cloudinary)

2. **Product Browsing:**
   - Homepage with hero slider
   - Featured categories
   - Browse by color
   - Product search (fuzzy search with Fuse.js)
   - Product filters (category, price, material, finish, etc.)
   - Pagination
   - Product details with image gallery
   - Product reviews and ratings

3. **Shopping Cart:**
   - Add/remove products
   - Update quantities
   - Variant selection (color, size)
   - Cart persistence (stored in user model)

4. **Wishlist:**
   - Add/remove products
   - Wishlist persistence

5. **Checkout:**
   - Multiple saved addresses
   - Address management
   - Payment integration (Stripe/Paytm)
   - Order placement

6. **Orders:**
   - Order history
   - Order tracking
   - Order details view

7. **Recently Viewed:**
   - Track viewed products
   - Display recently viewed items

#### **Admin Features:**
1. **Dashboard:**
   - Total orders, revenue, users
   - Sales charts and analytics
   - Recent orders overview

2. **Product Management:**
   - Create/edit/delete products
   - Image upload (multiple images)
   - Tiles-specific fields management
   - Bulk pricing setup
   - Stock management
   - Review management

3. **Order Management:**
   - View all orders
   - Update order status (Processing → Shipped → Delivered)
   - Delete orders
   - Order details

4. **User Management:**
   - View all users
   - Update user roles (user/admin/superadmin)
   - Delete users

5. **Coupons:**
   - Coupon management interface

6. **Blogs:**
   - Blog management interface

7. **Settings:**
   - App configuration

---

### **🚧 Planned/Incomplete Features**

Based on the README roadmap:

1. **Wishlist API** - Frontend exists, backend integration needed
2. **Coupons & Discounts** - UI exists, backend API needed
3. **Multiple Addresses** - Model exists, full CRUD needed
4. **Blogs Management** - UI exists, backend API needed
5. **Advanced Analytics** - Dashboard stats endpoint needed
6. **Email Notifications** - SendGrid configured but not fully implemented
7. **Store Application** - Pages exist, functionality unclear

---

## 🔐 **Authentication Flow**

1. **Registration:**
   - User submits: name, email, gender, password
   - Backend hashes password with bcrypt
   - Creates user in MongoDB
   - Returns JWT token in HTTP-only cookie

2. **Login:**
   - User submits: email, password
   - Backend validates credentials
   - Compares hashed password
   - Returns JWT token in cookie

3. **Protected Routes:**
   - Middleware checks JWT token in cookie
   - Verifies token with JWT_SECRET
   - Attaches user to request object
   - Role-based access control (user/admin/superadmin)

---

## 💳 **Payment Flow**

1. **Stripe Integration:**
   - Frontend gets Stripe API key from backend
   - User enters payment details
   - Frontend creates payment intent
   - Backend processes payment
   - Order created on successful payment

2. **Paytm Integration:**
   - Similar flow with Paytm gateway
   - Configured for Indian market

---

## 📦 **Product Data Flow**

### **Frontend → Backend:**
1. User visits `/products`
2. Frontend calls `getAllProducts()` server action
3. Server action fetches from `http://localhost:4000/api/v1/products/all`
4. Backend queries MongoDB with filters
5. Returns products array
6. Frontend transforms data and displays

### **Product Transformation:**
- Backend returns MongoDB document
- Frontend `transformProduct()` function converts to UI format
- Creates dummy variants for compatibility
- Formats images, dimensions, etc.

---

## 🎨 **UI Components**

### **Homepage Sections:**
- `HeroSlider` - Carousel with promotional slides
- `CollectionGrid` - Shop by room type
- `FeaturedCategories` - Category cards
- `FeaturedProductsSection` - Highlighted products
- `BrowseByColor` - Color-based filtering
- `AccessoriesSection` - Accessories showcase
- `LatestBlogs` - Blog posts
- `Testimonials` - Customer reviews

### **Product Components:**
- `ProductItem` - Product card
- `GridProducts` - Product grid layout
- `ProductsSkeleton` - Loading skeleton
- `ProductDetail` - Full product page
- `ProductGallery` - Image viewer
- `ProductReviews` - Reviews section

### **Cart/Checkout:**
- `CartItem` - Cart product card
- `CartSummary` - Price breakdown
- `CheckoutForm` - Checkout flow
- `AddressSelector` - Address management

### **Admin Components:**
- `DashboardStats` - Statistics cards
- `ProductForm` - Product create/edit
- `OrderTable` - Orders list
- `CustomerTable` - Users list

---

## 🔧 **Configuration**

### **Environment Variables:**

**Backend** (`backend/config/config.env`):
```env
PORT=4000
MONGO_URI=mongodb+srv://...
JWT_SECRET=...
JWT_EXPIRE=7d
COOKIE_EXPIRE=5
NODE_ENV=development
CLOUDINARY_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
STRIPE_API_KEY=...
STRIPE_SECRET_KEY=...
SENDGRID_API_KEY=...
PAYTM_MID=...
```

**Frontend** (`tilesecommerse/.env.local`):
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_ENV=development
```

---

## 📊 **Data Models Summary**

| Model | Collections | Key Features |
|-------|-------------|--------------|
| **User** | users | Auth, Cart, Wishlist, Addresses, Recently Viewed |
| **Product** | products | Tiles-specific fields, Reviews, Bulk pricing |
| **Order** | orders | Shipping, Payment, Status tracking |
| **Category** | categories | Product categorization |
| **Payment** | payments | Transaction records |

---

## 🚀 **Deployment**

### **Current Setup:**
- **Frontend:** Vercel (`https://ecom-fe-xi.vercel.app`)
- **Backend:** Vercel Serverless (`https://tileecommerse.vercel.app`)
- **Database:** MongoDB Atlas (Cloud)
- **Images:** Cloudinary (Cloud)

### **Local Development:**
- Backend: `http://localhost:4000`
- Frontend: `http://localhost:3000`
- Database: MongoDB Atlas (same cluster)

---

## 🐛 **Known Issues & Limitations**

1. **Deprecation Warnings:**
   - Mongoose `strictQuery` option (harmless)
   - `punycode` module (Node.js internal)

2. **Missing Features:**
   - Wishlist backend API not connected
   - Coupons backend not implemented
   - Blogs backend not implemented
   - Email notifications not fully configured

3. **Security:**
   - MongoDB credentials were exposed (need to rotate)
   - Using `0.0.0.0/0` IP whitelist (development only)

4. **Performance:**
   - No caching implemented
   - No CDN for images (using Cloudinary)
   - No database indexing optimization

---

## 📈 **Development Roadmap**

### **Phase 1: Core Features** (Current)
- ✅ User authentication
- ✅ Product CRUD
- ✅ Cart functionality
- ✅ Order placement
- ✅ Admin dashboard

### **Phase 2: Enhanced Features** (Next)
- ⏳ Wishlist API integration
- ⏳ Coupons system
- ⏳ Multiple addresses CRUD
- ⏳ Email notifications
- ⏳ Advanced analytics

### **Phase 3: Content & Polish**
- ⏳ Blogs system
- ⏳ Settings management
- ⏳ Performance optimization
- ⏳ SEO improvements

### **Phase 4: Production**
- ⏳ Security audit
- ⏳ Load testing
- ⏳ Documentation
- ⏳ Launch

---

## 🎯 **Business Logic**

### **Tiles E-Commerce Specific:**

1. **Product Variants:**
   - Dimensions (12x12, 24x24, etc.)
   - Materials (ceramic, porcelain, marble)
   - Finishes (glossy, matte, textured)
   - Room types (bathroom, kitchen, floor)

2. **Bulk Pricing:**
   - Quantity-based discounts
   - Stored as array: `[{ minQty: 10, price: 45 }]`

3. **Technical Specs:**
   - Water absorption rates
   - Slip resistance ratings (R9-R13)
   - Coverage per box
   - Weight specifications

4. **Inventory:**
   - Stock tracking
   - Auto-decrease on shipment
   - Low stock alerts (admin)

---

## 📝 **Code Quality**

### **Strengths:**
- ✅ TypeScript for type safety
- ✅ Component-based architecture
- ✅ Separation of concerns (MVC pattern)
- ✅ Error boundaries
- ✅ Loading states
- ✅ Responsive design

### **Areas for Improvement:**
- ⚠️ No unit tests
- ⚠️ No integration tests
- ⚠️ Limited error handling
- ⚠️ No logging system
- ⚠️ No API documentation (Swagger)

---

## 🔍 **Next Steps for Development**

1. **Immediate:**
   - Connect wishlist to backend API
   - Implement coupon system
   - Add email notifications

2. **Short-term:**
   - Add product search filters
   - Implement blogs system
   - Enhance admin analytics

3. **Long-term:**
   - Add automated testing
   - Implement caching
   - Optimize database queries
   - Add monitoring/logging

---

**Analysis Complete!** ✅

This document provides a comprehensive overview of the Tiles E-Commerce application. Ready for development and enhancements!
