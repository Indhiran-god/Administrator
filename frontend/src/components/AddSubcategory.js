import React, { useState, useEffect } from 'react';
import { CgClose } from "react-icons/cg";
import SummaryApi from '../common/index';
import { toast } from 'react-toastify';

const AddSubcategory = ({ onClose, fetchCategories }) => {
    const [data, setData] = useState({
        name: "",
        categoryName: "",
        subcategoryImages: []
    });

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadCategories = async () => {
            setLoading(true);
            try {
                const response = await fetch(SummaryApi.Category.url, {
                    method: SummaryApi.Category.method,
                });
                const result = await response.json();
                if (result.success) {
                    setCategories(result.data);
                } else {
                    setError(result.message || "Failed to fetch categories.");
                }
            } catch {
                setError("Error fetching categories.");
            } finally {
                setLoading(false);
            }
        };

        loadCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setData((prev) => ({
            ...prev,
            subcategoryImages: files.map((file) => URL.createObjectURL(file)),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!data.name || !data.categoryName) {
            toast.error("Please fill in all required fields.");
            return;
        }

        const payload = {
            name: data.name,
            categoryName: data.categoryName,
            image: data.subcategoryImages[0] || ""
        };

        try {
            setLoading(true);
            const response = await fetch(SummaryApi.addSubcategory.url, {
                method: SummaryApi.addSubcategory.method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            const responseData = await response.json();
            if (responseData.success) {
                toast.success("Subcategory added successfully!");
                onClose();
                fetchCategories();
            } else {
                toast.error(responseData.message || "Failed to add subcategory.");
            }
        } catch {
            toast.error("Error adding subcategory.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='fixed w-full h-full bg-gray-200 bg-opacity-70 top-0 left-0 flex justify-center items-center'>
            <div className='bg-white p-6 rounded-md shadow-md w-full max-w-md'>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-xl font-semibold'>Add Subcategory</h2>
                    <button onClick={onClose} className='text-xl hover:text-red-500'>
                        <CgClose />
                    </button>
                </div>
                <form className='space-y-4' onSubmit={handleSubmit}>
                    <div className="flex flex-col">
                        <label className='font-medium mb-1'>Select Category:</label>
                        <select
                            name="categoryName"
                            value={data.categoryName}
                            onChange={handleChange}
                            className='p-2 border rounded'
                        >
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                                <option key={category._id} value={category.name}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className='font-medium mb-1'>Subcategory Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={handleChange}
                            placeholder="Subcategory Name"
                            className='p-2 border rounded'
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className='font-medium mb-1'>Upload Subcategory Image:</label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept="image/*"
                            className='p-2 border rounded'
                        />
                    </div>
                    <button
                        type="submit"
                        className={`w-full py-2 text-white rounded ${loading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"}`}
                        disabled={loading}
                    >
                        {loading ? "Adding..." : "Add Subcategory"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddSubcategory;
