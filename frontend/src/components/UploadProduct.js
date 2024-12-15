import React, { useState, useEffect } from 'react';
import { CgClose } from "react-icons/cg";
import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';
import uploadImage from '../helpers/uploadImage';
import SummaryApi from '../common';

const UploadProduct = ({ onClose, fetchData }) => {
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    categoryId: "",
    subcategoryId: "",
    productImage: [], // Array for product images
    description: "",
    price: "",
    quantityOptions: [] // Array for quantity options
  });

  const [quantityOption, setQuantityOption] = useState({ quantity: '', price: '' });
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${SummaryApi.Category.url}`, {
          method: SummaryApi.Category.method
        });
        const result = await response.json();
        if (result.success) {
          setCategories(result.data);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error("Error fetching categories");
      }
    };
    fetchCategories();
  }, []);

  // Handle category change and fetch subcategories
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setData((prev) => ({
      ...prev,
      categoryId,
      subcategoryId: ""
    }));
    const selectedCategory = categories.find(cat => cat._id === categoryId);
    setSubCategories(selectedCategory?.subCategories || []);
  };

  // Handle input change for the form
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle product image upload
  const handleUploadProduct = async (e) => {
    const file = e.target.files[0];
    const uploadImageCloudinary = await uploadImage(file);
    setData(prev => ({
      ...prev,
      productImage: [...prev.productImage, uploadImageCloudinary.url]
    }));
  };

  // Handle product image deletion
  const handleDeleteProductImage = async (index) => {
    const newProductImage = [...data.productImage];
    newProductImage.splice(index, 1);
    setData(prev => ({
      ...prev,
      productImage: newProductImage
    }));
  };

  // Handle quantity option change
  const handleQuantityOptionChange = (e) => {
    const { name, value } = e.target;
    setQuantityOption(prev => ({ ...prev, [name]: value }));
  };

  // Add quantity option to the list
  const handleAddQuantityOption = () => {
    if (quantityOption.quantity && quantityOption.price) {
      setData(prev => ({
        ...prev,
        quantityOptions: [...prev.quantityOptions, quantityOption]
      }));
      setQuantityOption({ quantity: '', price: '' });
    } else {
      toast.error("Please enter both quantity and price for the option.");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = { ...data };
    if (!productData.subcategoryId) delete productData.subcategoryId;
    try {
      const response = await fetch(SummaryApi.uploadProduct.url, {
        method: SummaryApi.uploadProduct.method,
        credentials: 'include',
        headers: { "content-type": "application/json" },
        body: JSON.stringify(productData)
      });
      const responseData = await response.json();
      if (responseData.success) {
        toast.success(responseData.message);
        onClose();
        fetchData();
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      toast.error("Error uploading product");
    }
  };

  return (
    <div className='fixed w-full h-full bg-slate-200 bg-opacity-35 top-0 left-0 right-0 bottom-0 flex justify-center items-center'>
      <div className='bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden'>
        <div className='flex justify-between items-center pb-3'>
          <h2 className='font-bold text-lg'>Upload Product</h2>
          <div className='w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer' onClick={onClose}>
            <CgClose />
          </div>
        </div>

        <form className='grid p-4 gap-2 overflow-y-scroll h-full pb-5' onSubmit={handleSubmit}>
          <label htmlFor='productName' className='mt-3'>Product Name:</label>
          <input required type="text" name='productName' value={data.productName} onChange={handleOnChange} className='p-2 bg-slate-100 border rounded' />

          <label htmlFor='brandName' className='mt-3'>Brand Name:</label>
          <input type="text" name='brandName' value={data.brandName} onChange={handleOnChange} className='p-2 bg-slate-100 border rounded' />

          <label htmlFor='category' className='mt-3'>Category:</label>
          <select required value={data.categoryId} name='categoryId' onChange={handleCategoryChange} className='p-2 bg-slate-100 border rounded'>
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </select>

          <label htmlFor='subcategoryId' className='mt-3'>Subcategory:</label>
          <select required value={data.subcategoryId} name='subcategoryId' onChange={handleOnChange} className='p-2 bg-slate-100 border rounded'>
            <option value="">Select Subcategory</option>
            {subCategories.map(subcat => (
              <option key={subcat._id} value={subcat._id}>{subcat.name}</option>
            ))}
          </select>

          <label htmlFor='description' className='mt-3'>Description:</label>
          <textarea required name='description' value={data.description} onChange={handleOnChange} className='p-2 bg-slate-100 border rounded'></textarea>

          <label htmlFor='price' className='mt-3'>Price (MRP):</label>
          <input required type="number" name='price' value={data.price} onChange={handleOnChange} className='p-2 bg-slate-100 border rounded' />

          <label htmlFor='quantityOption' className='mt-3'>Quantity Options:</label>
          <div className='flex gap-2'>
            <input name='quantity' placeholder="Quantity" value={quantityOption.quantity} onChange={handleQuantityOptionChange} className='p-2 bg-slate-100 border rounded' />
            <input type="number" name='price' placeholder="Price" value={quantityOption.price} onChange={handleQuantityOptionChange} className='p-2 bg-slate-100 border rounded' />
            <button type="button" onClick={handleAddQuantityOption} className='px-3 py-2 bg-blue-500 text-white rounded'>Add</button>
          </div>

          <ul>
            {data.quantityOptions.map((option, index) => (
              <li key={index}>Quantity: {option.quantity}, Price: {option.price}</li>
            ))}
          </ul>

          <label htmlFor='productImage' className='mt-3'>Product Image:</label>
          <input type="file" onChange={handleUploadProduct} className='p-2 bg-slate-100 border rounded' />
          <div className='flex flex-wrap gap-2'>
            {data.productImage.map((imgUrl, index) => (
              <div key={index} className='relative'>
                <img src={imgUrl} alt="Product" className='w-20 h-20 object-cover' />
                <button type="button" className='absolute top-0 right-0 text-red-500 hover:text-red-600' onClick={() => handleDeleteProductImage(index)}>
                  <MdDelete />
                </button>
              </div>
            ))}
          </div>

          <button className='px-3 py-2 bg-green-600 text-white mb-10 hover:bg-green-700 rounded-full'>Upload Product</button>
        </form>
      </div>
    </div>
  );
};

export default UploadProduct;
