const Product = require('../models/productModel');
const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const SearchFeatures = require('../utils/searchFeatures');
const ErrorHandler = require('../utils/errorHandler');
const cloudinary = require('cloudinary');

// Get All Products
exports.getAllProducts = asyncErrorHandler(async (req, res, next) => {

    const resultPerPage = 12;
    const productsCount = await Product.countDocuments();
    // console.log(req.query);

    const searchFeature = new SearchFeatures(Product.find(), req.query)
        .search()
        .filter();

    await searchFeature.filterByCategory();

    let products = await searchFeature.query.populate('category subcategory', 'name slug');
    let filteredProductsCount = products.length;

    searchFeature.pagination(resultPerPage);

    products = await searchFeature.query.clone().populate('category subcategory', 'name slug');

    res.status(200).json({
        success: true,
        products,
        productsCount,
        resultPerPage,
        filteredProductsCount,
    });
});

// Get All Products ---Product Sliders
exports.getProducts = asyncErrorHandler(async (req, res, next) => {
    const products = await Product.find().populate('category subcategory', 'name slug');

    res.status(200).json({
        success: true,
        products,
    });
});

// Get Product Details
exports.getProductDetails = asyncErrorHandler(async (req, res, next) => {

    const product = await Product.findById(req.params.id).populate('category subcategory', 'name slug');

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    res.status(200).json({
        success: true,
        product,
    });
});

// Get All Products ---ADMIN
exports.getAdminProducts = asyncErrorHandler(async (req, res, next) => {
    const products = await Product.find().populate('category subcategory', 'name slug');

    res.status(200).json({
        success: true,
        products,
    });
});

// Create Product ---ADMIN
exports.createProduct = asyncErrorHandler(async (req, res, next) => {

    let images = [];
    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    const imagesLink = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
        });

        imagesLink.push({
            public_id: result.public_id,
            url: result.secure_url,
            isFeatured: i === 0 ? true : false, // First image is featured by default
        });
    }

    req.body.images = imagesLink;
    req.body.user = req.user.id;

    let specs = [];
    req.body.specifications.forEach((s) => {
        specs.push(JSON.parse(s))
    });
    req.body.specifications = specs;

    // Handle tags (if it's a string, convert to array)
    if (req.body.tags && typeof req.body.tags === 'string') {
        req.body.tags = JSON.parse(req.body.tags);
    }

    // Handle variants with images
    if (req.body.variants && typeof req.body.variants === 'string') {
        const variants = JSON.parse(req.body.variants);

        // Process variant images
        const processedVariants = [];
        for (const variant of variants) {
            const variantData = { ...variant };

            // Upload variant images if they exist
            if (variant.images && Array.isArray(variant.images) && variant.images.length > 0) {
                const variantImagesLink = [];

                for (let i = 0; i < variant.images.length; i++) {
                    const result = await cloudinary.v2.uploader.upload(variant.images[i], {
                        folder: "products/variants",
                    });

                    variantImagesLink.push({
                        public_id: result.public_id,
                        url: result.secure_url,
                        isFeatured: i === (variant.featuredImageIndex || 0)
                    });
                }

                variantData.images = variantImagesLink;
                delete variantData.featuredImageIndex; // Remove this as we use isFeatured instead
            }

            processedVariants.push(variantData);
        }

        req.body.variants = processedVariants;
    }

    // Handle tiles-specific fields
    if (req.body.dimensions) {
        req.body.dimensions = JSON.parse(req.body.dimensions);
    }

    if (req.body.roomType && typeof req.body.roomType === 'string') {
        req.body.roomType = JSON.parse(req.body.roomType);
    }

    if (req.body.bulkPricing && typeof req.body.bulkPricing === 'string') {
        req.body.bulkPricing = JSON.parse(req.body.bulkPricing);
    }

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    });
});

// Update Product ---ADMIN
exports.updateProduct = asyncErrorHandler(async (req, res, next) => {

    console.log('=== UPDATE PRODUCT DEBUG ===');
    console.log('Product ID:', req.params.id);
    console.log('Request Body Keys:', Object.keys(req.body));
    console.log('Request Body:', JSON.stringify(req.body, null, 2));

    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    if (req.body.images !== undefined) {
        let images = [];
        if (typeof req.body.images === "string") {
            images.push(req.body.images);
        } else if (Array.isArray(req.body.images)) {
            images = req.body.images;
        }

        if (images && images.length > 0) {
            if (product.images && product.images.length > 0) {
                for (let i = 0; i < product.images.length; i++) {
                    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
                }
            }

            const imagesLink = [];

            for (let i = 0; i < images.length; i++) {
                const result = await cloudinary.v2.uploader.upload(images[i], {
                    folder: "products",
                });

                imagesLink.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                    isFeatured: i === 0 ? true : false,
                });
            }
            req.body.images = imagesLink;
        }
    }

    // FIX: Handle featured image index update (when user changes featured image without uploading new ones)
    if (req.body.featuredImageIndex !== undefined && product.images && product.images.length > 0) {
        const featuredIndex = parseInt(req.body.featuredImageIndex);
        if (featuredIndex >= 0 && featuredIndex < product.images.length) {
            // Update all images to set only the selected one as featured
            product.images.forEach((img, index) => {
                img.isFeatured = index === featuredIndex;
            });
            // Mark the images field as modified so Mongoose saves it
            product.markModified('images');
            await product.save();
        }
        // Remove featuredImageIndex from req.body so it doesn't get saved as a field
        delete req.body.featuredImageIndex;
    }

    // Handle brand logo update
    if (req.body.logo && req.body.logo.length > 0) {
        // Delete old logo if exists
        if (product.brand && product.brand.logo && product.brand.logo.public_id) {
            await cloudinary.v2.uploader.destroy(product.brand.logo.public_id);
        }

        const result = await cloudinary.v2.uploader.upload(req.body.logo, {
            folder: "brands",
        });
        const brandLogo = {
            public_id: result.public_id,
            url: result.secure_url,
        };

        req.body.brand = {
            name: req.body.brandname,
            logo: brandLogo
        };
    } else if (req.body.brandname) {
        // Update brand name only if logo not provided
        req.body.brand = {
            name: req.body.brandname,
            logo: product.brand?.logo // Keep existing logo
        };
    }

    if (req.body.specifications && Array.isArray(req.body.specifications) && req.body.specifications.length > 0) {
        let specs = [];
        req.body.specifications.forEach((s) => {
            if (typeof s === 'string') {
                specs.push(JSON.parse(s));
            } else {
                specs.push(s);
            }
        });
        req.body.specifications = specs;
    }

    // Handle tiles-specific fields
    if (req.body.dimensions && typeof req.body.dimensions === 'string') {
        req.body.dimensions = JSON.parse(req.body.dimensions);
    }

    if (req.body.roomType && typeof req.body.roomType === 'string') {
        req.body.roomType = JSON.parse(req.body.roomType);
    }

    if (req.body.bulkPricing && typeof req.body.bulkPricing === 'string') {
        req.body.bulkPricing = JSON.parse(req.body.bulkPricing);
    }

    // Handle tags (if it's a string, convert to array)
    if (req.body.tags && typeof req.body.tags === 'string') {
        req.body.tags = JSON.parse(req.body.tags);
    }

    // Handle variants (if it's a string, parse it)
    if (req.body.variants && typeof req.body.variants === 'string') {
        req.body.variants = JSON.parse(req.body.variants);
    }

    req.body.user = req.user.id;

    console.log('=== ABOUT TO UPDATE ===');
    console.log('Update Data:', JSON.stringify(req.body, null, 2));

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    console.log('=== UPDATED PRODUCT ===');
    console.log('Updated Product Name:', product.name);
    console.log('Updated Product Description:', product.description?.substring(0, 100));
    console.log('Updated Product Price:', product.price);

    res.status(201).json({
        success: true,
        product
    });
});

// Delete Product ---ADMIN
exports.deleteProduct = asyncErrorHandler(async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    await product.remove();

    res.status(201).json({
        success: true
    });
});

// Create OR Update Reviews
exports.createProductReview = asyncErrorHandler(async (req, res, next) => {

    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    }

    const product = await Product.findById(productId);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    const isReviewed = product.reviews.find(review => review.user.toString() === req.user._id.toString());

    if (isReviewed) {

        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString())
                (rev.rating = rating, rev.comment = comment);
        });
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avg = 0;

    product.reviews.forEach((rev) => {
        avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    });
});

// Get All Reviews of Product
exports.getProductReviews = asyncErrorHandler(async (req, res, next) => {

    const product = await Product.findById(req.query.id);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews
    });
});

// Delete Reveiws
exports.deleteReview = asyncErrorHandler(async (req, res, next) => {

    const product = await Product.findById(req.query.productId);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    const reviews = product.reviews.filter((rev) => rev._id.toString() !== req.query.id.toString());

    let avg = 0;

    reviews.forEach((rev) => {
        avg += rev.rating;
    });

    let ratings = 0;

    if (reviews.length === 0) {
        ratings = 0;
    } else {
        ratings = avg / reviews.length;
    }

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings: Number(ratings),
        numOfReviews,
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    });
});