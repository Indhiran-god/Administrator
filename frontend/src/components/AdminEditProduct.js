import React, { useEffect, useState } from 'react';
import { CgClose } from "react-icons/cg";
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../helpers/uploadImage';
import DisplayImage from './DisplayImage';
import { MdDelete } from "react-icons/md";
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const AdminEditProduct = ({ onClose, productData, fetchdata }) => {
    const [data, setData] = useState({
        ...productData,
        productImage: productData?.productImage || [],
        quantityOptions: productData?.quantityOptions || []  // Initialize quantity options
    });
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
    const [fullScreenImage, setFullScreenImage] = useState("");
    const [newQuantityOption, setNewQuantityOption] = useState({ quantity: '', price: '' });

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            const response = await fetch(SummaryApi.Category.url, {
                method: SummaryApi.Category.method,
                credentials: 'include',
                headers: {
                    "content-type": "application/json"
                }
            });

            const responseData = await response.json();
            if (responseData.success) {
                setCategories(responseData.data);
            } else {
                toast.error(responseData.message);
            }
        };

        fetchCategories();
    }, []);

    // Fetch subcategories when category changes
    useEffect(() => {
        const fetchSubcategories = async () => {
            if (data.category) {
                const { url, method } = SummaryApi.getSubcategories(data.category);
                try {
                    const response = await fetch(url, {
                        method,
                        credentials: 'include',
                        headers: {
                            "content-type": "application/json"
                        }
                    });

                    const responseData = await response.json();
                    if (responseData.success) {
                        setSubcategories(responseData.data);
                    } else {
                        toast.error(responseData.message);
                    }
                } catch (error) {
                    console.error("Error fetching subcategories:", error);
                    toast.error("Failed to fetch subcategories.");
                }
            } else {
                setSubcategories([]);
            }
        };

        fetchSubcategories();
    }, [data.category]);

    // Handle field changes
    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle image upload
    const handleUploadProduct = async (e) => {
        const file = e.target.files[0];
        const uploadImageCloudinary = await uploadImage(file);

        setData((prev) => ({
            ...prev,
            productImage: [...prev.productImage, uploadImageCloudinary.url]
        }));
    };

    // Handle deleting product image
    const handleDeleteProductImage = (index) => {
        const newProductImage = [...data.productImage];
        newProductImage.splice(index, 1);
        setData((prev) => ({
            ...prev,
            productImage: newProductImage
        }));
    };

    // Add a new quantity option
    const handleAddQuantityOption = () => {
        if (newQuantityOption.quantity && newQuantityOption.price) {
            setData((prev) => ({
                ...prev,
                quantityOptions: [...prev.quantityOptions, newQuantityOption]
            }));
            setNewQuantityOption({ quantity: '', price: '' });  // Reset input fields
        } else {
            toast.error("Both quantity and price are required.");
        }
    };

    // Delete a quantity option
    const handleDeleteQuantityOption = (index) => {
        const updatedOptions = [...data.quantityOptions];
        updatedOptions.splice(index, 1);
        setData((prev) => ({
            ...prev,
            quantityOptions: updatedOptions
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const categoryId = categories.find(cat => cat.name === data.category)?._id;
        const subcategoryId = data.subcategory;

        const updatedData = {
            ...data,
            categoryId,
            subcategoryId
        };

        const response = await fetch(SummaryApi.updateProduct.url, {
            method: SummaryApi.updateProduct.method,
            credentials: 'include',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(updatedData)
        });

        const responseData = await response.json();

        if (responseData.success) {
            toast.success(responseData.message);
            onClose();
            fetchdata();
        } else {
            toast.error(responseData.message);
        }
    };

    return (
        <div className='fixed w-full h-full bg-slate-200 bg-opacity-35 top-0 left-0 right-0 bottom-0 flex justify-center items-center'>
            <div className='bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden'>
                <div className='flex justify-between items-center pb-3'>
                    <h2 className='font-bold text-lg'>Edit Product</h2>
                    <div className='w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer' onClick={onClose}>
                        <CgClose />
                    </div>
                </div>

                <form className='grid p-4 gap-2 overflow-y-scroll h-full pb-5' onSubmit={handleSubmit}>
                    {/* Product Name */}
                    <label htmlFor='productName'>Product Name :</label>
                    <input
                        type='text'
                        id='productName'
                        placeholder='Enter product name'
                        name='productName'
                        value={data.productName}
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                        required
                    />

                    {/* Brand Name */}
                    <label htmlFor='brandName' className='mt-3'>Brand Name :</label>
                    <input
                        type='text'
                        id='brandName'
                        placeholder='Enter brand name'
                        value={data.brandName}
                        name='brandName'
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                    />

                    {/* Category */}
                    <label htmlFor='category' className='mt-3'>Category :</label>
                    <select required value={data.category} name='category' onChange={handleOnChange} className='p-2 bg-slate-100 border rounded'>
                        <option value="">Select Category</option>
                        {categories.map((el) => (
                            <option value={el.name} key={el._id}>{el.name}</option>
                        ))}
                    </select>

                    {/* Subcategory */}
                    <label htmlFor='subcategory' className='mt-3'>Subcategory :</label>
                    <select required value={data.subcategory} name='subcategory' onChange={handleOnChange} className='p-2 bg-slate-100 border rounded'>
                        <option value="">Select Subcategory</option>
                        {subcategories.map((el) => (
                            <option value={el._id} key={el._id}>{el.name}</option>
                        ))}
                    </select>

                    {/* Product Images */}
                    <label htmlFor='productImage' className='mt-3'>Product Image :</label>
                    <label htmlFor='uploadImageInput'>
                        <div className='p-2 bg-slate-100 border rounded h-32 w-full flex justify-center items-center cursor-pointer'>
                            <div className='text-slate-500 flex justify-center items-center flex-col gap-2'>
                                <span className='text-4xl'><FaCloudUploadAlt /></span>
                                <p className='text-sm'>Upload Product Image</p>
                                <input type='file' id='uploadImageInput' className='hidden' onChange={handleUploadProduct} />
                            </div>
                        </div>
                    </label>

                    {/* Display Images */}
                    <div>
                        {data.productImage.length > 0 ? (
                            <div className='flex items-center gap-2'>
                                {data.productImage.map((el, index) => (
                                    <div className='relative group' key={index}>
                                        <img
                                            src={el}
                                            alt={el}
                                            width={80}
                                            height={80}
                                            className='bg-slate-100 border cursor-pointer'
                                            onClick={() => {
                                                setOpenFullScreenImage(true);
                                                setFullScreenImage(el);
                                            }}
                                        />
                                        <div className='absolute bottom-0 right-0 p-1 text-white bg-red-600 rounded-full hidden group-hover:block cursor-pointer' onClick={() => handleDeleteProductImage(index)}>
                                            <MdDelete />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className='text-red-600 text-xs'>*Please upload product image</p>
                        )}
                    </div>

                    {/* Quantity Options */}
                    <label htmlFor='quantityOptions' className='mt-3'>Quantity Options :</label>
                    <div className='flex gap-2'>
                        <input
                        
                            value={newQuantityOption.quantity}
                            placeholder='Quantity'
                            onChange={(e) => setNewQuantityOption({ ...newQuantityOption, quantity: e.target.value })}
                            className='p-2 bg-slate-100 border rounded'
                        />
                        <input
                            type='number'
                            value={newQuantityOption.price}
                            placeholder='Price'
                            onChange={(e) => setNewQuantityOption({ ...newQuantityOption, price: e.target.value })}
                            className='p-2 bg-slate-100 border rounded'
                        />
                        <button type='button' onClick={handleAddQuantityOption} className='p-2 bg-green-600 text-white rounded'>
                            Add Option
                        </button>
                    </div>

                    <div>
                        {data.quantityOptions.length > 0 ? (
                            <div className='mt-2'>
                                {data.quantityOptions.map((option, index) => (
                                    <div key={index} className='flex justify-between items-center bg-slate-100 p-2 mb-2 rounded'>
                                        <p>Qty: {option.quantity}, Price: {option.price}</p>
                                        <MdDelete className='text-red-600 cursor-pointer' onClick={() => handleDeleteQuantityOption(index)} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className='text-red-600 text-xs'>*Please add at least one quantity option</p>
                        )}
                    </div>

                    {/* Price */}
                    <label htmlFor='price' className='mt-3'>Price :</label>
                    <input
                        type='number'
                        id='price'
                        placeholder='Enter price'
                        value={data.price}
                        name='price'
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                        required
                    />

                    {/* Description */}
                    <label htmlFor='description' className='mt-3'>Description :</label>
                    <textarea
                        className='h-28 bg-slate-100 border resize-none p-1'
                        placeholder='Enter product description'
                        rows={3}
                        onChange={handleOnChange}
                        name='description'
                        value={data.description}
                    />

                    <button type='submit' className='px-3 py-2 bg-red-600 text-white mb-10 hover:bg-red-700'>
                        Update Product
                    </button>
                </form>

                {openFullScreenImage && (
                    <DisplayImage onClose={() => setOpenFullScreenImage(false)} imgUrl={fullScreenImage} />
                )}
            </div>
        </div>
    );
}

export default AdminEditProduct;
