import React, { useEffect, useState } from 'react';
import { CgClose } from "react-icons/cg";
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../helpers/uploadImage';
import DisplayImage from './DisplayImage';
import { MdDelete } from "react-icons/md";
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const AdminEditSubcategory = ({ onClose, subcategoryData, fetchdata }) => {
    const [data, setData] = useState({
        ...subcategoryData,
        subcategoryImage: subcategoryData?.subcategoryImage || [],
    });
    const [categories, setCategories] = useState([]);
    const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
    const [fullScreenImage, setFullScreenImage] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await fetch(SummaryApi.Category.url, {
                method: SummaryApi.Category.method,
                credentials: 'include',
                headers: {
                    "content-type": "application/json"
                }
            });

            const responseData = await response.json();
            if (responseData.success) {
                setCategories(responseData.data);
            } else {
                toast.error(responseData.message);
            }
        };

        fetchCategories();
    }, []);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUploadSubcategory = async (e) => {
        const file = e.target.files[0];
        const uploadImageCloudinary = await uploadImage(file);

        setData((prev) => ({
            ...prev,
            subcategoryImage: [...prev.subcategoryImage, uploadImageCloudinary.url]
        }));
    };

    const handleDeleteSubcategoryImage = (index) => {
        const newSubcategoryImage = [...data.subcategoryImage];
        newSubcategoryImage.splice(index, 1);
        setData((prev) => ({
            ...prev,
            subcategoryImage: newSubcategoryImage
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const categoryId = categories.find(cat => cat.name === data.category)?._id; // Get the ID of the selected category

        const updatedData = {
            ...data,
            categoryId // Include category ID
        };

        const response = await fetch(SummaryApi.updateSubcategory.url, {
            method: SummaryApi.updateSubcategory.method,
            credentials: 'include',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(updatedData) // Use updated data
        });

        const responseData = await response.json();

        if (responseData.success) {
            toast.success(responseData.message);
            onClose();
            fetchdata();
        } else {
            toast.error(responseData.message);
        }
    };

    return (
        <div className='fixed w-full h-full bg-slate-200 bg-opacity-35 top-0 left-0 right-0 bottom-0 flex justify-center items-center'>
            <div className='bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden'>
                <div className='flex justify-between items-center pb-3'>
                    <h2 className='font-bold text-lg'>Edit Subcategory</h2>
                    <div className='w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer' onClick={onClose}>
                        <CgClose />
                    </div>
                </div>

                <form className='grid p-4 gap-2 overflow-y-scroll h-full pb-5' onSubmit={handleSubmit}>
                    <label htmlFor='subcategoryName'>Subcategory Name :</label>
                    <input
                        type='text'
                        id='subcategoryName'
                        placeholder='Enter subcategory name'
                        name='subcategoryName'
                        value={data.subcategoryName}
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                        required
                    />

                    <label htmlFor='category' className='mt-3'>Category :</label>
                    <select required value={data.category} name='category' onChange={handleOnChange} className='p-2 bg-slate-100 border rounded'>
                        <option value="">Select Category</option>
                        {categories.map((el) => (
                            <option value={el.name} key={el._id}>{el.name}</option>
                        ))}
                    </select>

                    <label htmlFor='subcategoryImage' className='mt-3'>Subcategory Image :</label>
                    <label htmlFor='uploadImageInput'>
                        <div className='p-2 bg-slate-100 border rounded h-32 w-full flex justify-center items-center cursor-pointer'>
                            <div className='text-slate-500 flex justify-center items-center flex-col gap-2'>
                                <span className='text-4xl'><FaCloudUploadAlt /></span>
                                <p className='text-sm'>Upload Subcategory Image</p>
                                <input type='file' id='uploadImageInput' className='hidden' onChange={handleUploadSubcategory} />
                            </div>
                        </div>
                    </label>

                    <div>
                        {data.subcategoryImage.length > 0 ? (
                            <div className='flex items-center gap-2'>
                                {data.subcategoryImage.map((el, index) => (
                                    <div className='relative group' key={index}>
                                        <img
                                            src={el}
                                            alt={el}
                                            width={80}
                                            height={80}
                                            className='bg-slate-100 border cursor-pointer'
                                            onClick={() => {
                                                setOpenFullScreenImage(true);
                                                setFullScreenImage(el);
                                            }}
                                        />
                                        <div className='absolute bottom-0 right-0 p-1 text-white bg-red-600 rounded-full hidden group-hover:block cursor-pointer' onClick={() => handleDeleteSubcategoryImage(index)}>
                                            <MdDelete />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className='text-red-600 text-xs'>*Please upload subcategory image</p>
                        )}
                    </div>

                    <button className='px-3 py-2 bg-green-600 text-white mb-10 hover:bg-green-700'>Update Subcategory</button>
                </form>

                {openFullScreenImage && (
                    <DisplayImage onClose={() => setOpenFullScreenImage(false)} imgUrl={fullScreenImage} />
                )}
            </div>
        </div>
    );
}

export default AdminEditSubcategory;
