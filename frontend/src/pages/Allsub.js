import React, { useEffect, useState } from 'react';
import AddSubcategory from '../components/AddSubcategory';
import SummaryApi from '../common';
import AdminSubcategoryCard from '../components/AdminSubcategoryCard';
import { toast } from 'react-toastify';

const AllSubcategories = () => {
  const [openAddSubcategory, setOpenAddSubcategory] = useState(false);
  const [allSubcategories, setAllSubcategories] = useState([]);

  // Fetch all subcategories from the backend
  const fetchAllSubcategories = async () => {
    try {
      const response = await fetch(SummaryApi.getAllSubcategories.url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication if needed
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const dataResponse = await response.json();
      if (dataResponse.success) {
        setAllSubcategories(dataResponse.data || []);
      } else {
        toast.error(dataResponse.message || 'Failed to fetch subcategories');
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      toast.error('Error fetching subcategories: ' + error.message);
    }
  };

  useEffect(() => {
    fetchAllSubcategories(); // Fetch subcategories on component mount
  }, []);

  return (
    <div>
      <div className='bg-white py-2 px-4 flex justify-between items-center'>
        <h2 className='font-bold text-lg'>All Subcategories</h2>
        <button
          className='border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all py-1 px-3 rounded-full'
          onClick={() => setOpenAddSubcategory(true)}
        >
          Add Subcategory
        </button>
      </div>

      {/* Display all subcategories */}
      <div className='flex items-center flex-wrap gap-5 py-4 h-[calc(100vh-190px)] overflow-y-scroll'>
        {allSubcategories.length > 0 ? (
          allSubcategories.map((subcategory) => (
            <AdminSubcategoryCard
              key={subcategory._id} // Use subcategory ID as key
              data={subcategory}
              fetchdata={fetchAllSubcategories}
            />
          ))
        ) : (
          <p>No subcategories available.</p>
        )}
      </div>

      {/* Add Subcategory component */}
      {openAddSubcategory && (
        <AddSubcategory
          onClose={() => setOpenAddSubcategory(false)}
          fetchCategories={fetchAllSubcategories}
        />
      )}
    </div>
  );
};

export default AllSubcategories;

