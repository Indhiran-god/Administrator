import React, { useState, useEffect } from 'react';
import { CgClose } from "react-icons/cg";
import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';
import uploadImage from '../helpers/uploadImage';
import SummaryApi from '../common';

const UploadProduct = ({ onClose, fetchData }) => {
  const [data, setData] = useState({
    productName: "",
    brandName: "", // Optional field
    categoryId: "",
    subcategoryId: "",
    productImage: [],
    description: "",
    price: "",
    quantityOptions: []
  });

  const [quantityOption, setQuantityOption] = useState({ quantity: '', price: '' });
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

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

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUploadProduct = async (e) => {
    const file = e.target.files[0];
    const uploadImageCloudinary = await uploadImage(file);
    setData(prev => ({
      ...prev,
      productImage: [...prev.productImage, uploadImageCloudinary.url]
    }));
  };

  const handleDeleteProductImage = async (index) => {
    const newProductImage = [...data.productImage];
    newProductImage.splice(index, 1);
    setData(prev => ({
      ...prev,
      productImage: newProductImage
    }));
  };

  const handleQuantityOptionChange = (e) => {
    const { name, value } = e.target;
    setQuantityOption(prev => ({ ...prev, [name]: value }));
  };

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

          <label htmlFor='categoryId'>Category:</label>
          <select name='categoryId' value={data.categoryId} onChange={handleCategoryChange} className='p-2 bg-slate-100 border rounded'>
            <option value=''>Select a category</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>{category.categoryName}</option>
            ))}
          </select>

          <label htmlFor='subcategoryId'>Subcategory:</label>
          <select name='subcategoryId' value={data.subcategoryId} onChange={handleOnChange} className='p-2 bg-slate-100 border rounded'>
            <option value=''>Select a subcategory</option>
            {subCategories.map(subCategory => (
              <option key={subCategory._id} value={subCategory._id}>{subCategory.subCategoryName}</option>
            ))}
          </select>

          <label htmlFor='description'>Description:</label>
          <textarea name='description' value={data.description} onChange={handleOnChange} className='p-2 bg-slate-100 border rounded'></textarea>

          <label htmlFor='price'>Price:</label>
          <input required type="number" name='price' value={data.price} onChange={handleOnChange} className='p-2 bg-slate-100 border rounded' />

          <label htmlFor='productImage'>Product Images:</label>
          <input type="file" onChange={handleUploadProduct} className='p-2 bg-slate-100 border rounded' />
          <div className='flex gap-2'>
            {data.productImage.map((image, index) => (
              <div key={index} className='relative'>
                <img src={image} alt={`Product ${index}`} className='w-16 h-16 object-cover rounded' />
                <button type='button' onClick={() => handleDeleteProductImage(index)} className='absolute top-0 right-0 text-red-500'>
                  <MdDelete />
                </button>
              </div>
            ))}
          </div>

          <label htmlFor='quantityOptions'>Quantity Options:</label>
          <div className='flex gap-2'>
            <input type="number" name='quantity' value={quantityOption.quantity} onChange={handleQuantityOptionChange} placeholder='Quantity' className='p-2 bg-slate-100 border rounded' />
            <input type="number" name='price' value={quantityOption.price} onChange={handleQuantityOptionChange} placeholder='Price' className='p-2 bg-slate-100 border rounded' />
            <button type='button' onClick={handleAddQuantityOption} className='bg-blue-500 text-white px-3 py-2 rounded'>Add</button>
          </div>
          <ul>
            {data.quantityOptions.map((option, index) => (
              <li key={index}>{option.quantity} units - ${option.price}</li>
            ))}
          </ul>

          <button type='submit' className='bg-green-500 text-white px-3 py-2 rounded'>Upload Product</button>
        </form>
      </div>
    </div>
  );
};

export default UploadProduct;
