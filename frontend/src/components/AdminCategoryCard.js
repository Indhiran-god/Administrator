import React, { useState } from 'react';
import { MdDelete, MdEdit } from "react-icons/md";
import { toast } from 'react-toastify';
import SummaryApi from '../common';
import AdminEditCategory from './AdminEditCategory'; // Import the Edit Category Component

const AdminCategoryCard = ({ data, fetchdata }) => {
    const [isEditing, setIsEditing] = useState(false); // State to handle editing

    const handleDeleteCategory = async () => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            try {
                const categoryId = data._id;

                if (!categoryId) {
                    toast.error('Invalid category ID');
                    return;
                }

                const response = await fetch(SummaryApi.deleteCategory(categoryId).url, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });

                const responseData = await response.json();
                if (response.ok && responseData.success) {
                    toast.success(responseData.message);
                    fetchdata();
                } else {
                    toast.error(responseData.message || 'Failed to delete category');
                }
            } catch (error) {
                console.error('Error while deleting category:', error);
                toast.error('An error occurred while deleting the category');
            }
        }
    };

    const handleEditCategory = () => {
        setIsEditing(true); // Open the edit modal
    };

    const handleCloseEdit = () => {
        setIsEditing(false); // Close the edit modal
    };

    // Log the image URLs to debug
    console.log('Image Paths:', data?.images);

    // Check if images exist and are valid
    const images = data?.images || [];
    const fullImageUrls = images.map(imageUrl => 
        imageUrl?.startsWith('http') ? imageUrl : `http://localhost:5000/${imageUrl}`
    );

    return (
        <div className='bg-white p-4 rounded shadow h-64 flex flex-col justify-between'>
            <div className='flex flex-col items-center flex-grow'>
                {images.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2 mb-2">
                        {fullImageUrls.map((imageUrl, index) => (
                            <img
                                key={index}
                                src={imageUrl} // Ensure it's the correct image URL
                                alt={`Category Image ${index + 1}`}
                                className='w-24 h-24 object-cover rounded'
                            />
                        ))}
                    </div>
                ) : (
                    <div className='w-32 h-32 bg-gray-200 rounded mb-2 flex items-center justify-center'>
                        <span>No Image Available</span>
                    </div>
                )}
                <h1 className='font-bold text-lg text-center flex-grow overflow-hidden text-ellipsis whitespace-nowrap'>
                    {data?.name || 'Unnamed Category'}
                </h1>
            </div>

            <div className='flex justify-between mt-2'>
                <button
                    className='text-blue-500'
                    onClick={handleEditCategory}
                >
                    <MdEdit />
                </button>
                <button
                    className='text-red-500'
                    onClick={handleDeleteCategory}
                >
                    <MdDelete />
                </button>
            </div>

            {isEditing && (
                <AdminEditCategory
                    onClose={handleCloseEdit}
                    categoryData={data}
                    fetchdata={fetchdata}
                />
            )}
        </div>
    );
};

export default AdminCategoryCard;
