import React, { useState } from 'react';
import { MdDelete, MdEdit } from "react-icons/md";
import { toast } from 'react-toastify';
import SummaryApi from '../common';
import AdminEditSubcategory from './Admineditsubcategory'; // Import the Edit Subcategory Component

const AdminSubcategoryCard = ({ data, fetchdata }) => {
    const [isEditing, setIsEditing] = useState(false);

    const handleDeleteSubcategory = async () => {
        if (window.confirm("Are you sure you want to delete this subcategory?")) {
            try {
                const subcategoryId = data._id;

                if (!subcategoryId) {
                    toast.error('Invalid subcategory ID');
                    return;
                }

                const response = await fetch(SummaryApi.deleteSubcategory(subcategoryId).url, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                const responseData = await response.json();
                if (response.ok && responseData.success) {
                    toast.success(responseData.message);
                    fetchdata();
                } else {
                    toast.error(responseData.message || 'Failed to delete subcategory');
                }
            } catch (error) {
                console.error('Error while deleting subcategory:', error);
                toast.error('An error occurred while deleting the subcategory');
            }
        }
    };

    const handleEditSubcategory = () => {
        setIsEditing(true);
    };

    const handleCloseEdit = () => {
        setIsEditing(false);
    };

    const subcategoryImages = data?.images || []; // Correct the image key to 'images'

    // Debugging: Log the image array to check the data
    console.log("Subcategory images: ", subcategoryImages);

    const getGridClasses = () => {
        switch (subcategoryImages.length) {
            case 1:
                return 'grid-cols-1';
            case 2:
                return 'grid-cols-2';
            case 3:
                return 'grid-cols-2 gap-x-2';
            case 4:
                return 'grid-cols-2 gap-x-2 gap-y-2';
            default:
                return 'grid-cols-1';
        }
    };

    if (isEditing) {
        document.body.style.overflow = 'hidden'; // Disable scroll
    } else {
        document.body.style.overflow = 'auto'; // Enable scroll
    }

    return (
        <div className='bg-white p-3 rounded shadow w-56 h-auto flex flex-col justify-between'>
            <div className='flex flex-col items-center flex-grow'>
                {subcategoryImages.length > 0 ? (
                    <div className={`grid ${getGridClasses()} gap-1 w-full`}>
                        {subcategoryImages.map((image, index) => (
                            <div key={index} className='relative w-full h-24'>
                                <img
                                    src={image || '/default-placeholder-image.jpg'} // Default fallback if image is empty
                                    alt={`Subcategory ${data?.name || ''} Image ${index + 1}`}
                                    className='w-full h-full object-cover rounded'
                                    onError={(e) => {
                                        e.target.src = '/default-placeholder-image.jpg'; // Provide a fallback image
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='w-full h-24 bg-gray-200 rounded mb-2 flex items-center justify-center'>
                        <span>No images available</span>
                    </div>
                )}
                <h4 className='mt-2 font-semibold text-lg text-center'>
                    {data?.name || 'Unnamed Subcategory'}
                </h4>
            </div>

            <div className="flex justify-between items-center mt-3">
                <MdEdit
                    size={20}
                    className='text-green-500 cursor-pointer hover:text-green-700'
                    onClick={handleEditSubcategory}
                />
                <MdDelete
                    size={20}
                    className='text-red-500 cursor-pointer hover:text-red-700'
                    onClick={handleDeleteSubcategory}
                />
            </div>

            {isEditing && (
                <AdminEditSubcategory
                    onClose={handleCloseEdit}
                    subcategoryData={data}
                    fetchdata={fetchdata}
                />
            )}
        </div>
    );
};

export default AdminSubcategoryCard;
