import React, { useEffect, useState } from 'react';
import AddCategory from '../components/AddCategory'; // Assuming you have an AddCategory component
import SummaryApi from '../common';  // Import SummaryApi
import AdminCategoryCard from '../components/AdminCategoryCard'; // Assuming you have an AdminCategoryCard component
import { toast } from 'react-toastify';

const AllCategory = () => {
  const [openAddCategory, setOpenAddCategory] = useState(false);
  const [categories, setCategories] = useState([]); // Fixed typo here from cCategories to setCategories

  // Fetch all categories from the backend
  const fetchAllCategories = async () => {
    try {
      // Check if the URL is defined in the SummaryApi
      if (!SummaryApi.Category || !SummaryApi.Category.url) {
        throw new Error('API URL is not defined');
      }

      const response = await fetch(SummaryApi.Category.url);

      // Check if the response is not OK
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const dataResponse = await response.json();
      if (dataResponse.success) {
        setCategories(dataResponse.data || []);
      } else {
        toast.error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Error fetching categories: ' + error.message);
    }
  };

  useEffect(() => {
    fetchAllCategories(); // Fetch categories on component mount
  }, []);

  return (
    <div>
      <div className='bg-white py-2 px-4 flex justify-between items-center'>
        <h2 className='font-bold text-lg'>All Categories</h2>
        <button
          className='border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all py-1 px-3 rounded-full'
          onClick={() => setOpenAddCategory(true)}
        >
          Add Category
        </button>
      </div>

      {/* Display all categories */}
      <div className='flex items-center flex-wrap gap-5 py-4 h-[calc(100vh-190px)] overflow-y-scroll'>
        {categories.length > 0 ? (
          categories.map((category) => (
            <AdminCategoryCard
              key={category._id} // Use category ID as key
              data={category}
              fetchdata={fetchAllCategories} // Pass the fetch function to the card
            />
          ))
        ) : (
          <p>No categories available.</p>
        )}
      </div>

      {/* Add Category component */}
      {openAddCategory && (
        <AddCategory
          onClose={() => setOpenAddCategory(false)}
          fetchCategories={fetchAllCategories}
        />
      )}
    </div>
  );
};

export default AllCategory;
