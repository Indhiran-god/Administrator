const Category = require('../models/Category'); // Adjust the path as necessary

const deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.params; // Get category ID from request parameters

        // Ensure ID is provided
        if (!categoryId) {
            return res.status(400).json({ success: false, message: 'Invalid category ID' });
        }

        // Find and delete the category by ID
        const deletedCategory = await Category.findByIdAndDelete(categoryId);

        if (!deletedCategory) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        res.json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = deleteCategory;
