import React, { useState } from 'react';
import { MdDelete, MdEdit } from "react-icons/md";
import { toast } from 'react-toastify';
import SummaryApi from '../common';
import AdminEditSubcategory from './Admineditsubcategory'; // Import the Edit Subcategory Component

const AdminSubcategoryCard = ({ data, fetchdata }) => {
    const [isEditing, setIsEditing] = useState(false); // State to handle editing

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
                    credentials: 'include'
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
        setIsEditing(true); // Open the edit modal
    };

    const handleCloseEdit = () => {
        setIsEditing(false); // Close the edit modal
    };

    const images = data?.image || []; // Array of images

    return (
        <div className='bg-white p-4 rounded shadow h-64 flex flex-col justify-between'>
            <div className='flex flex-col items-center flex-grow'>
                {images.length > 0 ? (
                    <div
                        className={`grid ${
                            images.length === 1
                                ? 'grid-cols-1'
                                : images.length === 2
                                ? 'grid-cols-2'
                                : 'grid-cols-2 gap-2'
                        } mb-2`}
                    >
                        {images.map((imageUrl, index) => (
                            <img
                                key={index}
                                src={imageUrl}
                                alt={`Subcategory ${index + 1}`}
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
                    {data?.name || 'Unnamed Subcategory'}
                </h1>
            </div>

            <div className='flex justify-between mt-2'>
                <button
                    className='text-blue-500'
                    onClick={handleEditSubcategory}
                >
                    <MdEdit />
                </button>
                <button
                    className='text-red-500'
                    onClick={handleDeleteSubcategory}
                >
                    <MdDelete />
                </button>
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
