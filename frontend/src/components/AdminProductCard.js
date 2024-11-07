import React, { useState } from 'react';
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import AdminEditProduct from './AdminEditProduct';
import displayINRCurrency from '../helpers/displayCurrency';
import { toast } from 'react-toastify';
import SummaryApi from '../common';

const AdminProductCard = ({ data, fetchdata }) => {
    const [editProduct, setEditProduct] = useState(false);
    const [selectedQuantity, setSelectedQuantity] = useState(""); // For tracking selected quantity option

    // Handle deletion of product
    const handleDeleteProduct = async () => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                const response = await fetch(SummaryApi.deleteProduct(data._id).url, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Error response:', errorData);
                    throw new Error(errorData.message || 'Failed to delete product');
                }

                const responseData = await response.json();
                if (responseData.success) {
                    toast.success(responseData.message);
                    fetchdata(); // Refresh the product list
                } else {
                    toast.error(responseData.message || 'Failed to delete product');
                }
            } catch (error) {
                console.error('Error while deleting product:', error);
                toast.error('An error occurred while deleting the product');
            }
        }
    };

    // Handle quantity option change
    const handleQuantityChange = (e) => {
        setSelectedQuantity(e.target.value);
    };

    // Get the selected quantity price
    const selectedOption = data.quantityOptions?.find(option => option.quantity === selectedQuantity);

    return (
        <div className='bg-white p-4 rounded'>
            <div className='w-40'>
                <div className='w-32 h-32 flex justify-center items-center'>
                    <img src={data?.productImage[0]} className='mx-auto object-fill h-full' alt={data.productName} />
                </div>
                <h1 className='text-ellipsis line-clamp-2'>{data.productName}</h1>
                <div>
                    {/* Display the base price (MRP) with a strike-through */}
                    <div className='text-red-500 line-through'>
                        <p className='font-semibold'>{displayINRCurrency(data.price)}</p>
                    </div>
                    
                    {/* Quantity Dropdown */}
                    {data.quantityOptions && data.quantityOptions.length > 0 && (
                        <div className='mt-2'>
                            <label htmlFor="quantityOptions" className="block text-sm font-semibold">Quantity:</label>
                            <select
                                value={selectedQuantity}
                                onChange={handleQuantityChange}
                                className="p-2 bg-slate-100 border rounded w-full"
                            >
                                <option value="">--Select Quantity--</option>
                                {data.quantityOptions.map((option, index) => (
                                    <option key={index} value={option.quantity}>
                                        {option.quantity} for {displayINRCurrency(option.price)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Display the discounted price for the selected quantity */}
                    {selectedQuantity && selectedOption && (
                        <div className='mt-2'>
                            <p className='font-semibold text-green-500'>
                                Price for {selectedQuantity} items: {displayINRCurrency(selectedOption.price)}
                            </p>
                        </div>
                    )}

                    <div className='flex justify-between mt-3'>
                        <button className='text-green-500' onClick={() => setEditProduct(!editProduct)}>
                            <MdModeEditOutline />
                        </button>
                        <button className='text-red-500' onClick={handleDeleteProduct}>
                            <MdDelete />
                        </button>
                    </div>
                </div>
            </div>

            {/* If editProduct is true, show AdminEditProduct component */}
            {editProduct && (
                <AdminEditProduct
                    onClose={() => setEditProduct(false)}
                    productData={data}
                    fetchdata={fetchdata}
                />
            )}
        </div>
    );
};

export default AdminProductCard;
