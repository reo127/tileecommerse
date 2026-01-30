const Category = require('../models/categoryModel');
const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const ErrorHandler = require('../utils/errorHandler');

// Create Category - Admin only
exports.createCategory = asyncErrorHandler(async (req, res, next) => {
    const { name, description, parent, order, isActive } = req.body;

    if (!name) {
        return next(new ErrorHandler("Please provide category name", 400));
    }

    // Check if category with same name exists
    const existingCategory = await Category.findOne({
        name: { $regex: new RegExp(`^${name}$`, 'i') }
    });

    if (existingCategory) {
        return next(new ErrorHandler("Category with this name already exists", 400));
    }

    const category = await Category.create({
        name,
        description,
        parent: parent || null,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
        createdBy: req.user.id
    });

    res.status(201).json({
        success: true,
        category,
        message: "Category created successfully"
    });
});

// Get All Categories (Tree Structure) - Admin
exports.getAllCategories = asyncErrorHandler(async (req, res, next) => {
    const includeInactive = req.query.includeInactive === 'true';
    const tree = await Category.getCategoryTree(includeInactive);

    res.status(200).json({
        success: true,
        count: tree.length,
        categories: tree
    });
});

// Get Active Categories (Tree Structure) - Public
exports.getActiveCategories = asyncErrorHandler(async (req, res, next) => {
    const tree = await Category.getCategoryTree(false);

    res.status(200).json({
        success: true,
        count: tree.length,
        categories: tree
    });
});

// Get Single Category - Public
exports.getCategory = asyncErrorHandler(async (req, res, next) => {
    const category = await Category.findOne({
        $or: [
            { _id: req.params.id },
            { slug: req.params.id }
        ]
    }).populate('parent', 'name slug');

    if (!category) {
        return next(new ErrorHandler("Category not found", 404));
    }

    // Get children if it's a parent category
    const children = await category.getChildren();

    res.status(200).json({
        success: true,
        category: {
            ...category.toObject(),
            children
        }
    });
});

// Update Category - Admin only
exports.updateCategory = asyncErrorHandler(async (req, res, next) => {
    let category = await Category.findById(req.params.id);

    if (!category) {
        return next(new ErrorHandler("Category not found", 404));
    }

    // If updating name, check for duplicates
    if (req.body.name && req.body.name !== category.name) {
        const existingCategory = await Category.findOne({
            name: { $regex: new RegExp(`^${req.body.name}$`, 'i') },
            _id: { $ne: req.params.id }
        });

        if (existingCategory) {
            return next(new ErrorHandler("Category with this name already exists", 400));
        }
    }

    // If updating parent, validate
    if (req.body.parent) {
        // Cannot set self as parent
        if (req.body.parent === req.params.id) {
            return next(new ErrorHandler("Category cannot be its own parent", 400));
        }

        // Check if it would create a child category with children
        const hasChildren = await category.hasChildren();
        if (hasChildren) {
            return next(new ErrorHandler("Cannot make a parent category a subcategory", 400));
        }

        // Validate parent exists and is not a child
        const parent = await Category.findById(req.body.parent);
        if (!parent) {
            return next(new ErrorHandler("Parent category not found", 404));
        }
        if (parent.parent) {
            return next(new ErrorHandler("Cannot create more than 2 levels of categories", 400));
        }
    }

    category = await Category.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    );

    res.status(200).json({
        success: true,
        category,
        message: "Category updated successfully"
    });
});

// Delete Category - Admin only
exports.deleteCategory = asyncErrorHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        return next(new ErrorHandler("Category not found", 404));
    }

    // Check if category has children
    const hasChildren = await category.hasChildren();
    if (hasChildren) {
        return next(new ErrorHandler("Cannot delete category with subcategories. Delete subcategories first.", 400));
    }

    // Check if category has products
    if (category.productCount > 0) {
        return next(new ErrorHandler(`Cannot delete category with ${category.productCount} products. Reassign products first.`, 400));
    }

    await category.deleteOne();

    res.status(200).json({
        success: true,
        message: "Category deleted successfully"
    });
});

// Toggle Category Status - Admin only
exports.toggleCategoryStatus = asyncErrorHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        return next(new ErrorHandler("Category not found", 404));
    }

    category.isActive = !category.isActive;
    await category.save();

    res.status(200).json({
        success: true,
        category,
        message: `Category ${category.isActive ? 'activated' : 'deactivated'} successfully`
    });
});

// Reorder Categories - Admin only
exports.reorderCategories = asyncErrorHandler(async (req, res, next) => {
    const { categories } = req.body; // Array of { id, order }

    if (!categories || !Array.isArray(categories)) {
        return next(new ErrorHandler("Please provide categories array", 400));
    }

    // Update order for each category
    await Promise.all(
        categories.map(async ({ id, order }) => {
            await Category.findByIdAndUpdate(id, { order });
        })
    );

    res.status(200).json({
        success: true,
        message: "Categories reordered successfully"
    });
});
