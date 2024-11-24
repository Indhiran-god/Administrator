import React, { useState, useEffect } from 'react';
import { CgClose } from "react-icons/cg";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import uploadImage from '../helpers/uploadImage'; // Helper function to upload images
import { toast } from 'react-toastify';
import SummaryApi from '../common';

const AdminEditCategory = ({ onClose, categoryData, fetchCategories }) => {
    const [data, setData] = useState({
        name: categoryData?.name || '',
        categoryImage: categoryData?.categoryImage || []
    });

    useEffect(() => {
        setData({
            name: categoryData?.name || '',
            categoryImage: categoryData?.categoryImage || []
        });
    }, [categoryData]);

    // Handle changes to the category name
    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle uploading a new category image
    const handleUploadCategoryImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const uploadedImage = await uploadImage(file);
            setData((prev) => ({
                ...prev,
                categoryImage: [...prev.categoryImage, uploadedImage.url]
            }));
            toast.success("Image uploaded successfully!");
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image.");
        }
    };

    // Handle deleting an image
    const handleDeleteImage = (index) => {
        const updatedImages = [...data.categoryImage];
        updatedImages.splice(index, 1);
        setData((prev) => ({
            ...prev,
            categoryImage: updatedImages
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedData = {
            name: data.name,
            categoryImage: data.categoryImage
        };

        try {
            const response = await fetch(`${SummaryApi.updateCategory.url.replace(':categoryId', categoryData._id)}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedData)
            });

            const responseData = await response.json();
            console.log("Response Data:", responseData);  // Log the response

            if (responseData.success) {
                toast.success(responseData.message);
                onClose();   // Close the modal
                fetchCategories();  // Fetch updated categories

                // Reload the page after the update
                console.log("Reloading page...");  // Check if this log is printed
                window.location.reload();  // This will reload the entire page
            } else {
                toast.error(responseData.message);
            }
        } catch (error) {
            toast.error("An error occurred while updating the category.");
            console.error(error);
        }
    };

    return (
        <div className='fixed w-full h-full bg-slate-200 bg-opacity-35 top-0 left-0 right-0 bottom-0 flex justify-center items-center z-50'>
            <div className='bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden'>
                <div className='flex justify-between items-center pb-3'>
                    <h2 className='font-bold text-lg'>Edit Category</h2>
                    <div className='w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer' onClick={onClose}>
                        <CgClose />
                    </div>
                </div>

                <form className='grid p-4 gap-2 overflow-y-scroll h-full pb-5' onSubmit={handleSubmit}>
                    {/* Category Name */}
                    <label htmlFor='name'>Category Name:</label>
                    <input
                        type='text'
                        id='name'
                        name='name'
                        placeholder='Enter category name'
                        value={data.name}
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                        required
                    />

                    {/* Category Images */}
                    <label>Category Images:</label>
                    <div className='grid grid-cols-3 gap-2'>
                        {data.categoryImage.map((image, index) => (
                            <div key={index} className='relative'>
                                <img
                                    src={image}
                                    alt={`Category ${index}`}
                                    className='w-full h-24 object-cover rounded'
                                />
                                <button
                                    type='button'
                                    className='absolute top-1 right-1 text-red-500'
                                    onClick={() => handleDeleteImage(index)}
                                >
                                    <MdDelete size={20} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className='mt-2'>
                        <label htmlFor='uploadImage' className='cursor-pointer text-blue-500'>
                            <FaCloudUploadAlt className='inline-block mr-2' />
                            Upload Category Image
                        </label>
                        <input
                            type='file'
                            id='uploadImage'
                            name='categoryImage'
                            className='hidden'
                            accept="image/*"
                            onChange={handleUploadCategoryImage}
                        />
                    </div>

                    {/* Submit Button */}
                    <button type='submit' className='mt-3 w-full bg-green-500 text-white p-2 rounded-full'>
                        update                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminEditCategory;
