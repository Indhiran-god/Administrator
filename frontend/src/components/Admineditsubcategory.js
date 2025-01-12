import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import SummaryApi from '../common';
import uploadImage from '../helpers/uploadImage';

const AdminEditSubcategory = ({ onClose, subcategoryData, fetchdata }) => {
    const [categories, setCategories] = useState([]);
    const [data, setData] = useState({
        name: subcategoryData?.name || '',
        categoryId: subcategoryData?.categoryId || '',
        subcategoryImage: subcategoryData?.images || [], // Ensure the images are initialized properly
    });

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(SummaryApi.Category.url, {
                    method: SummaryApi.Category.method,
                    credentials: 'include',
                    headers: {
                        'content-type': 'application/json',
                    },
                });

                const responseData = await response.json();

                if (responseData.success) {
                    setCategories(responseData.data);
                } else {
                    toast.error(responseData.message);
                }
            } catch (error) {
                toast.error('Failed to fetch categories.');
                console.error(error);
            }
        };

        fetchCategories();
    }, []);

    // Handle input field changes
    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle image upload
    const handleUploadSubcategoryImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const uploadedImage = await uploadImage(file); // Assume this function uploads the image and returns a URL
            setData((prev) => ({
                ...prev,
                subcategoryImage: [...prev.subcategoryImage, uploadedImage.url], // Add the uploaded image URL to the array
            }));
            toast.success('Image uploaded successfully!');
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Failed to upload image.');
        }
    };

    // Handle image deletion
    const handleDeleteImage = (index) => {
        const updatedImages = data.subcategoryImage.filter((_, idx) => idx !== index);
        setData((prev) => ({
            ...prev,
            subcategoryImage: updatedImages,  // Correctly update the subcategoryImage array
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate category selection
        if (!data.categoryId) {
            toast.error('Please select a category.');
            return;
        }

        const updatedData = {
            subcategoryId: subcategoryData._id, // Send subcategory ID for updating
            newCategoryId: data.categoryId, // Send newCategoryId
            name: data.name, // Subcategory name
            subcategoryImage: data.subcategoryImage, // Ensure images are included
        };

        try {
            const response = await fetch(SummaryApi.updateSubcategory.url, {
                method: 'PUT',  // Use PUT method to update the subcategory
                credentials: 'include',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            const responseData = await response.json();

            if (responseData.success) {
                toast.success(responseData.message);
                onClose();
                fetchdata(); // Refresh the subcategory data
            } else {
                toast.error(responseData.message);
            }
        } catch (error) {
            toast.error('An error occurred while updating the subcategory.');
            console.error(error);
        }
    };

    return (
        <div className='fixed w-full h-full bg-slate-200 bg-opacity-35 top-0 left-0 flex justify-center items-center z-50'>
            <div className='bg-white p-4 rounded w-full max-w-2xl z-60'>
                <div className='flex justify-between items-center pb-3'>
                    <h2 className='font-bold text-lg'>Edit Subcategory</h2>
                    <button onClick={onClose} className='text-2xl hover:text-red-600'>
                        X
                    </button>
                </div>
                <form onSubmit={handleSubmit} className='grid gap-4'>
                    <label htmlFor='name'>Subcategory Name:</label>
                    <input
                        id='name'
                        name='name'
                        value={data.name}
                        onChange={handleOnChange}
                        className='border p-2 rounded'
                        required
                    />
                    <label htmlFor='categoryId'>Category:</label>
                    <select
                        id='categoryId'
                        name='categoryId'
                        value={data.categoryId}
                        onChange={handleOnChange}
                        className='border p-2 rounded'
                        required
                    >
                        <option value=''>Select Category</option>
                        {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <label htmlFor='subcategoryImage'>Upload Images:</label>
                    <input
                        type='file'
                        accept='image/*'
                        onChange={handleUploadSubcategoryImage}
                        className='border p-2 rounded'
                    />
                    {data.subcategoryImage.length > 0 && (
                        <div className='flex gap-2'>
                            {data.subcategoryImage.map((image, idx) => (
                                <div key={idx} className='relative'>
                                    <img src={image} alt='subcategory' className='w-20 h-20 object-cover' />
                                    <button
                                        type='button'
                                        onClick={() => handleDeleteImage(idx)}
                                        className='absolute top-0 right-0 text-white bg-red-600 rounded-full'
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <button type='submit' className='bg-blue-500 text-white p-2 rounded'>
                        Update Subcategory
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminEditSubcategory;

