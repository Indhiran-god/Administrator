import React, { useState } from 'react';
import { CgClose } from "react-icons/cg";
import { toast } from 'react-toastify';
import SummaryApi from '../common';  // Import SummaryApi
import uploadImage from '../helpers/uploadImage';  // Ensure correct import path


const AddCategory = ({ onClose, fetchCategories }) => {
    const [data, setData] = useState({
        name: "",
        categoryImages: [] // Store multiple images in an array
    });

    // Handle form field changes
    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle image upload (multiple images)
    const handleUploadImage = async (e) => {
        const files = Array.from(e.target.files);
        try {
            // Assuming uploadImage is a function that returns the uploaded image URL
            const imageUrls = await Promise.all(files.map(file => uploadImage(file)));
            const newImageUrls = imageUrls.map(image => image.url);  // Extract URLs
            setData((prev) => ({
                ...prev,
                categoryImages: [...prev.categoryImages, ...newImageUrls] // Add new images to the array
            }));
        } catch (error) {
            toast.error("Error uploading image");
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields
        if (!data.name || data.categoryImages.length === 0) {
            toast.error("Please fill all required fields and upload at least one image");
            return;
        }

        const payload = {
            name: data.name,
            images: data.categoryImages,  // Send an array of image URLs
        };

        try {
            // Make the API call to add a new category
            const response = await fetch(SummaryApi.addCategory.url, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const responseData = await response.json();
            if (responseData.success) {
                toast.success(responseData.message);
                onClose();  // Close modal on success
                fetchCategories();  // Refresh the category list
            } else {
                toast.error(responseData.message);
            }
        } catch (error) {
            toast.error("Failed to add category");
        }
    };

    return (
        <div className='fixed w-full h-full bg-slate-200 bg-opacity-35 top-0 left-0 flex justify-center items-center'>
            <div className='bg-white p-4 rounded w-full max-w-md overflow-hidden'>
                <div className='flex justify-between items-center pb-3'>
                    <h2 className='font-bold text-lg'>Add Category</h2>
                    <div className='text-2xl hover:text-red-600 cursor-pointer' onClick={onClose}>
                        <CgClose />
                    </div>
                </div>

                <form className='grid p-4 gap-2' onSubmit={handleSubmit}>
                    <label htmlFor='name'>Category Name:</label>
                    <input
                        required
                        type="text"
                        name='name'
                        value={data.name}
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                    />

                    <label htmlFor='categoryImages'>Category Images:</label>
                    <input
                        type="file"
                        multiple  // Allow multiple file uploads
                        onChange={handleUploadImage}
                        className='p-2 bg-slate-100 border rounded'
                    />

                    <div className='flex flex-wrap gap-2'>
                        {data.categoryImages.map((image, index) => (
                            <div key={index} className='relative'>
                                <img
                                    src={image}
                                    alt={`Uploaded category image ${index + 1}`} // Updated alt text
                                    className='w-20 h-20 object-cover'
                                />
                            </div>
                        ))}
                    </div>

                    <button className='px-3 py-2 bg-green-600 text-white mb-10 hover:bg-green-700 rounded-full'>
                        Add Category
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddCategory;
