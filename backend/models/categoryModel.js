const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter category name"],
        trim: true,
        maxLength: [100, "Category name cannot exceed 100 characters"]
    },
    slug: {
        type: String,
        required: true,
        lowercase: true
        // Removed unique: true - will use compound index instead
    },
    description: {
        type: String,
        maxLength: [500, "Description cannot exceed 500 characters"]
    },
    image: {
        public_id: {
            type: String,
            required: false
        },
        url: {
            type: String,
            required: false
        }
    },
    parent: {
        type: mongoose.Schema.ObjectId,
        ref: "Category",
        default: null
    },
    level: {
        type: Number,
        default: 0,
        min: [0, "Level cannot be negative"],
        max: [1, "Maximum 2 levels allowed (0 for parent, 1 for child)"]
    },
    order: {
        type: Number,
        default: 0
    },
    productCount: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Compound unique index: slug must be unique within the same parent
// This allows "floor-tiles" to exist under multiple parent categories
categorySchema.index({ slug: 1, parent: 1 }, { unique: true });


// Create slug from name before validation (must run before validation)
categorySchema.pre('validate', function (next) {
    if (this.isModified('name') && !this.slug) {
        this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    next();
});

// Update the updatedAt field before saving
categorySchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Validate parent-child relationship
categorySchema.pre('save', async function (next) {
    if (this.parent) {
        const parent = await mongoose.model('Category').findById(this.parent);

        if (!parent) {
            return next(new Error('Parent category not found'));
        }

        // Check if parent is already a child (prevent 3rd level)
        if (parent.parent) {
            return next(new Error('Cannot create more than 2 levels of categories'));
        }

        // Set level to 1 (child)
        this.level = 1;
    } else {
        // Set level to 0 (parent)
        this.level = 0;
    }

    next();
});

// Method to get all children
categorySchema.methods.getChildren = async function () {
    return await mongoose.model('Category').find({ parent: this._id, isActive: true }).sort({ order: 1 });
};

// Method to check if category has children
categorySchema.methods.hasChildren = async function () {
    const count = await mongoose.model('Category').countDocuments({ parent: this._id });
    return count > 0;
};

// Static method to get category tree
categorySchema.statics.getCategoryTree = async function (includeInactive = false) {
    const query = includeInactive ? {} : { isActive: true };

    // Get all parent categories
    const parents = await this.find({ ...query, parent: null }).sort({ order: 1 });

    // Get all children for each parent
    const tree = await Promise.all(
        parents.map(async (parent) => {
            const children = await this.find({ ...query, parent: parent._id }).sort({ order: 1 });
            return {
                ...parent.toObject(),
                children
            };
        })
    );

    return tree;
};

module.exports = mongoose.model('Category', categorySchema);
