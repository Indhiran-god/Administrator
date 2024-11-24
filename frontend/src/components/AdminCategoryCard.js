import React, { useState } from 'react';
import { MdDelete, MdEdit } from "react-icons/md";
import { toast } from 'react-toastify';
import SummaryApi from '../common';
import AdminEditCategory from './AdminEditCategory';

const AdminCategoryCard = ({ data, fetchdata }) => {
    const [isEditing, setIsEditing] = useState(false);

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
        setIsEditing(true);
    };

    const handleCloseEdit = () => {
        setIsEditing(false);
    };

    const categoryImages = data?.categoryImage || [];

    // Function to determine the grid layout based on the number of images
    const getGridClasses = () => {
        switch (categoryImages.length) {
            case 1:
                return 'grid-cols-1';
            case 2:
                return 'grid-cols-2';
            case 3:
                return 'grid-cols-2 gap-x-2'; // Two images in the first row, one in the second
            case 4:
                return 'grid-cols-2 gap-x-2 gap-y-2'; // Two images in each row
            default:
                return 'grid-cols-1';
        }
    };

    // Disable scroll when modal is open
    if (isEditing) {
        document.body.style.overflow = 'hidden'; // Disable body scroll
    } else {
        document.body.style.overflow = 'auto'; // Enable body scroll
    }

    return (
        <div className='bg-white p-3 rounded shadow w-56 h-auto flex flex-col justify-between'>
            <div className='flex flex-col items-center flex-grow'>
                {categoryImages.length > 0 ? (
                    <div className={`grid ${getGridClasses()} gap-1 w-full`}>
                        {categoryImages.map((image, index) => (
                            <div key={index} className='relative w-full h-24'>
                                <img
                                    src={image}
                                    alt={`Category ${index}`}
                                    className='w-full h-full object-cover rounded'
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='w-full h-24 bg-gray-200 rounded mb-2 flex items-center justify-center'>
                        <span>No images available</span>
                    </div>
                )}
                <h4 className='mt-2 font-semibold text-lg text-center'>{data?.name}</h4>
            </div>

            <div className="flex justify-between items-center mt-3">
                <MdEdit
                    size={20}
                    className='text-green-500 cursor-pointer hover:text-green-700'
                    onClick={handleEditCategory}
                />
                <MdDelete
                    size={20}
                    className='text-red-500 cursor-pointer hover:text-red-700'
                    onClick={handleDeleteCategory}
                />
            </div>

            {isEditing && (
                <AdminEditCategory
                    onClose={handleCloseEdit}
                    categoryData={data}
                    fetchCategories={fetchdata}
                />
            )}
        </div>
    );
};

export default AdminCategoryCard;
