import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { CgClose } from 'react-icons/cg'; // Importing delete icon
import SummaryApi from '../common'; // Assuming you have API helpers for your requests

const AdminEditCategory = ({ categoryData, onClose, fetchData }) => {
  const [categoryName, setCategoryName] = useState(categoryData.name || '');
  const [categoryImages, setCategoryImages] = useState(categoryData.images || []);
  const [imageFile, setImageFile] = useState(null);
  const [categoryId, setCategoryId] = useState(categoryData.id || ''); // Ensure category ID is captured

  useEffect(() => {
    setCategoryName(categoryData.name);
    setCategoryImages(categoryData.images);
    setCategoryId(categoryData.id); // Set the category ID
  }, [categoryData]);

  // Handle category name change
  const handleCategoryNameChange = (e) => {
    setCategoryName(e.target.value);
  };

  // Handle file selection for image upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  // Function to remove image from the list of images
  const handleRemoveImage = (imageToRemove) => {
    setCategoryImages(categoryImages.filter(image => image !== imageToRemove));
  };

  // Handle saving the changes
  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('name', categoryName);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      // Send the PUT request to update the category by its ID
      const response = await fetch(SummaryApi.updateCategory(categoryId).url, {
        method: 'PUT',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      const responseData = await response.json();
      if (response.ok && responseData.success) {
        toast.success(responseData.message);
        if (fetchData) {
          fetchData(); // Reload the categories list after saving
        }
        onClose(); // Close the edit modal
      } else {
        toast.error(responseData.message || 'Failed to update category');
      }
    } catch (error) {
      console.error('Error while saving category:', error);
      toast.error('An error occurred while saving the category');
    }
  };

  return (
    <div className='fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center'>
      <div className='bg-white p-6 rounded shadow-lg w-96 max-w-full max-h-[80vh] overflow-auto'>
        <h2 className='text-xl font-semibold mb-4'>Edit Category</h2>

        <div className='mb-4'>
          <label htmlFor='categoryName' className='block text-sm font-medium mb-2'>
            Category Name
          </label>
          <input
            type='text'
            id='categoryName'
            value={categoryName}
            onChange={handleCategoryNameChange}
            className='w-full p-2 border rounded'
          />
        </div>

        <div className='mb-4'>
          <label htmlFor='categoryImage' className='block text-sm font-medium mb-2'>
            Category Image
          </label>
          <input
            type='file'
            id='categoryImage'
            accept='image/*'
            onChange={handleFileChange}
            className='w-full p-2 border rounded'
          />
          {/* Image preview section */}
          {categoryImages && categoryImages.length > 0 && (
            <div className='mt-4'>
              {categoryImages.map((image, index) => (
                <div key={index} className='relative mb-4'>
                  <img
                    src={image} // Displaying the image
                    alt='Category'
                    className='w-full h-32 object-cover rounded'
                  />
                  <button
                    onClick={() => handleRemoveImage(image)} // Removing the image
                    className='absolute top-0 right-0 text-red-500 bg-white rounded-full p-1'
                  >
                    <CgClose size={20} /> {/* Delete icon */}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className='flex justify-between'>
          <button onClick={onClose} className='px-4 py-2 bg-gray-500 text-white rounded'>
            Cancel
          </button>
          <button
            onClick={handleSave}
            className='px-4 py-2 bg-blue-500 text-white rounded'
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminEditCategory;
