const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter product name"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please enter product description"]
    },
    shortDescription: {
        type: String,
        required: false,
        maxlength: [200, "Short description cannot exceed 200 characters"]
    },
    highlights: [
        {
            type: String,
            required: true
        }
    ],
    specifications: [
        {
            title: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            }
        }
    ],
    price: {
        type: Number,
        required: [true, "Please enter product price"]
    },
    cuttedPrice: {
        type: Number,
        required: [true, "Please enter cutted price"]
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            },
            isFeatured: {
                type: Boolean,
                default: false
            }
        }
    ],
    brand: {
        name: {
            type: String,
            required: false
        },
        logo: {
            public_id: {
                type: String,
                required: false,
            },
            url: {
                type: String,
                required: false,
            }
        }
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: "Category",
        required: [true, "Please select product category"]
    },
    subcategory: {
        type: mongoose.Schema.ObjectId,
        ref: "Category",
        required: false
    },

    // Product ID (SKU or custom identifier)
    productId: {
        type: String,
        required: false,
        trim: true
    },

    // Tiles-specific fields
    dimensions: {
        length: {
            type: Number,
            required: false
        },
        width: {
            type: Number,
            required: false
        },
        unit: {
            type: String,
            enum: ['inches', 'cm', 'mm'],
            default: 'inches'
        }
    },

    material: {
        type: String,
        required: false
    },

    roomType: [{
        type: String,
        enum: ['bathroom', 'kitchen', 'living-room', 'bedroom', 'outdoor', 'floor', 'wall', 'commercial']
    }],

    finish: {
        type: String,
        required: false
    },

    color: {
        type: String,
        required: false
    },

    thickness: {
        type: Number, // in mm
        required: false
    },

    coverage: {
        type: Number, // sq ft per box
        required: false
    },

    tilesPerBox: {
        type: Number,
        required: false
    },

    weight: {
        type: Number, // kg per box
        required: false
    },

    waterAbsorption: {
        type: String, // e.g., '<0.5%', '0.5-3%', '>10%'
        required: false
    },

    slipResistance: {
        type: String, // e.g., 'R9', 'R10', 'R11', 'R12', 'R13'
        enum: ['R9', 'R10', 'R11', 'R12', 'R13', 'Not Rated'],
        required: false
    },

    bulkPricing: [{
        minQty: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],

    tags: [{
        type: String,
        trim: true
    }],

    // Product Variants
    hasVariants: {
        type: Boolean,
        default: false
    },
    variants: [{
        productId: {
            type: String,
            required: false,
            trim: true
        },
        color: {
            type: String,
            required: false
        },
        size: {
            type: String,
            required: false
        },
        finish: {
            type: String,
            required: false
        },
        price: {
            type: Number,
            required: false
        },
        stock: {
            type: Number,
            required: false
        }
    }],

    // End of tiles-specific fields

    stock: {
        type: Number,
        required: [true, "Please enter product stock"],
        maxlength: [4, "Stock cannot exceed limit"],
        default: 1
    },
    warranty: {
        type: Number,
        default: 1
    },
    ratings: {
        type: Number,
        default: 0
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],

    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema);