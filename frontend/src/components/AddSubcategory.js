import React, { useState, useEffect } from 'react';
import { CgClose } from "react-icons/cg";
import { toast } from 'react-toastify';
import SummaryApi from '../common'; // Import your API configuration
import uploadImage from '../helpers/uploadImage'; // Helper function for image uploads

const AddSubcategory = ({ onClose, fetchCategories }) => {
    const [data, setData] = useState({
        name: "",
        categoryName: "",
        subcategoryImages: [], // Store multiple images
    });

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                setLoading(true);
                const response = await fetch(SummaryApi.Category.url, {
                    method: SummaryApi.Category.method,
                });
                const result = await response.json();
                if (result.success) {
                    setCategories(result.data);
                } else {
                    toast.error(result.message || "Failed to fetch categories.");
                }
            } catch {
                toast.error("Error fetching categories.");
            } finally {
                setLoading(false);
            }
        };
        loadCategories();
    }, []);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUploadImage = async (e) => {
        const files = Array.from(e.target.files);
        try {
            const imageUrls = await Promise.all(
                files.map(async (file) => {
                    try {
                        const uploadedImage = await uploadImage(file);
                        return uploadedImage.url;
                    } catch (err) {
                        toast.error(`Failed to upload ${file.name}`);
                        throw err;
                    }
                })
            );
            setData((prev) => ({
                ...prev,
                subcategoryImages: [...prev.subcategoryImages, ...imageUrls],
            }));
        } catch {
            toast.error("Some images failed to upload. Please try again.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!data.name || !data.categoryName || data.subcategoryImages.length === 0) {
            toast.error("Please fill in all required fields and upload at least one image.");
            return;
        }

        const payload = {
            name: data.name,
            categoryName: data.categoryName,
            images: data.subcategoryImages,
        };

        try {
            setLoading(true);
            const response = await fetch(SummaryApi.addSubcategory.url, {
                method: 'POST',
                credentials: 'include',
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
        <div className='fixed w-full h-full bg-slate-200 bg-opacity-35 top-0 left-0 flex justify-center items-center'>
            <div className='bg-white p-4 rounded w-full max-w-md overflow-hidden'>
                <div className='flex justify-between items-center pb-3'>
                    <h2 className='font-bold text-lg'>Add Subcategory</h2>
                    <div className='text-2xl hover:text-red-600 cursor-pointer' onClick={onClose}>
                        <CgClose />
                    </div>
                </div>

                <form className='grid p-4 gap-2' onSubmit={handleSubmit}>
                    <label htmlFor='categoryName'>Select Category:</label>
                    <select
                        name="categoryName"
                        value={data.categoryName}
                        onChange={handleOnChange}
                        required
                        className='p-2 bg-slate-100 border rounded'
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category._id} value={category.name}>
                                {category.name}
                            </option>
                        ))}
                    </select>

                    <label htmlFor='name'>Subcategory Name:</label>
                    <input
                        required
                        type="text"
                        name='name'
                        value={data.name}
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                    />

                    <label htmlFor='subcategoryImages'>Subcategory Images:</label>
                    <input
                        type="file"
                        multiple
                        onChange={handleUploadImage}
                        className='p-2 bg-slate-100 border rounded'
                    />

                    <div className='flex flex-wrap gap-2'>
                        {data.subcategoryImages.map((image, index) => (
                            <div key={index} className='relative'>
                                <img src={image} alt={`Subcategory ${index}`} className='w-16 h-16 object-cover rounded' />
                            </div>
                        ))}
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
