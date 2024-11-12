const express = require('express');
const router = express.Router();
const userSignUpController = require("../controller/userSignUp");
const userSignInController = require("../controller/userSignIn");
const userDetailsController = require('../controller/userDetails');
const authToken = require('../middleware/authToken');
const userLogout = require('../controller/userLogout');
const allUsers = require('../controller/allUsers');
const updateUser = require('../controller/updateUser');
const UploadProductController = require('../controller/uploadProduct');
const updateProductController = require('../controller/updateProduct');
const getProductController = require('../controller/getProduct');
const deleteProductController = require('../controller/deleteproduct'); 
const getCategories = require('../controller/getCategory');
const getSubcategories = require('../controller/getSubcategory');
const addSubcategory = require('../controller/addSubcategory');
const getAllSubcategories = require('../controller/getAllSubcategories');
const getProductsBySubcategory = require('../controller/getProductsBySubcategory');
const deleteSubcategory = require('../controller/deletesubcategory');
const addCategory = require('../controller/addCategory');
const updateCategoryController = require('../controller/updateCategoryController');
const deleteCategory = require('../controller/deletecategory'); // Import deleteCategory controller

// User routes
router.post("/signup", userSignUpController); 
router.post("/signin", userSignInController); 
router.get("/user-details", authToken, userDetailsController); 
router.get("/userLogout", userLogout); 

// Admin panel
router.get("/all-user", authToken, allUsers); 
router.post("/update-user", authToken, updateUser); 

// Product routes
router.post("/upload-product", authToken, UploadProductController); 
router.get("/get-product", getProductController); 
router.put("/update-product", authToken, updateProductController); 
router.delete("/delete-product/:id", authToken, deleteProductController); 
router.get("/Category", getCategories); 
router.get('/category/:categoryName/subcategories', getSubcategories); 
router.post('/add-subcategories/:categoryId', authToken, addSubcategory); 
router.get('/subcategories', getAllSubcategories);
router.get('/subcategories/:subcategoryId/products', getProductsBySubcategory);
router.delete('/delete-subcategory/:subcategoryId', authToken, deleteSubcategory);
router.post('/addCategory', authToken, addCategory);
router.put("/categories", authToken, updateCategoryController); 
router.delete('/delete-category/:categoryId', authToken, deleteCategory); // Delete category route

module.exports = router;
