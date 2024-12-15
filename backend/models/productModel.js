const mongoose = require('mongoose');

// Define the product schema
const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    brandName: {
        type: String,
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // Reference to the Category model
        required: true
    },
    subcategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category.subCategories' // Reference to the subcategory within the Category model
    },
    productImage: {
        type: [String], // Array of image URLs
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: false
    },
    sellingPrice: {
        type: Number,
        required: true
    }
}, {
    timestamps: true // Automatically create `createdAt` and `updatedAt` fields
});

// Create the model
const productModel = mongoose.model('Product', productSchema);

// Export the model
module.exports = productModel;
