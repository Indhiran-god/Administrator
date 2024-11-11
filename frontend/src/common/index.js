const backendDomin = process.env.REACT_APP_BACKEND_URL
const SummaryApi = {
    signUP: {
        url: `${backendDomin}/api/signup`,
        method: "post"
    },
    signIn: {
        url: `${backendDomin}/api/signin`,
        method: "post"
    },
    current_user: {
        url: `${backendDomin}/api/user-details`,
        method: "get"
    },
    logout_user: {
        url: `${backendDomin}/api/userLogout`,
        method: 'get'
    },
    update_user: {
        url: `${backendDomin}/api/update-user`, // Changed to match the correct endpoint
        method: 'put' 
    },
    getProductDetails: (productId) => ({ // Updated to take productId as a parameter
        url: `${backendDomin}/api/product-details/${productId}`, // Use productId in URL
        method: 'get'
    }),
    updateUser: {
        url: `${backendDomin}/api/update-user`,
        method: "post"
    },
    Category: {
        url: `${backendDomin}/api/Category`,
        method: 'get'
    },
    getSubcategories: (categoryName) => ({
        url: `${backendDomin}/api/category/${categoryName}/subcategories`, // Use categoryName in URL
        method: 'get'
    }),
    getProducts: (subcategoryId) => ({ // Fixed the method to return an object
        url: `${backendDomin}/api/subcategories/${subcategoryId}/products`, // Use subcategoryId in URL
        method: 'get'
    }),
    addToCartProduct: {
        url: `${backendDomin}/api/addtocart`,
        method: 'post'
    },
    addToCartProductCount: {
        url: `${backendDomin}/api/countAddToCartProduct`,
        method: 'get'
    },
    addToCartProductView: {
        url: `${backendDomin}/api/view-card-product`,
        method: 'get'
    },
    updateCartProduct: {
        url: `${backendDomin}/api/update-cart-product`,
        method: 'post'
    },
    deleteCartProduct: {
        url: `${backendDomin}/api/delete-cart-product`,
        method: 'post'
    },
    searchProduct : {
        url : `${backendDomin}/api/search`,
        method : 'get'
    },
    getRelatedProducts: (subcategoryId) => ({ // New method for related products
        url: `${backendDomin}/api/related/${subcategoryId}`, // Use subcategoryId in URL
        method: 'get'
    }),
};

export default SummaryApi;
