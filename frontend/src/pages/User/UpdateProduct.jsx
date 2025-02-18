import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const UpdateProduct = () => {
  const [serialNumber, setSerialNumber] = useState('');
  const [brand, setBrand] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    console.log("Sending data:", { serialnumber: serialNumber, brand });
  
    try {
      const response = await axios.put(
        `/api/products/update-brand`,
        { serialnumber: serialNumber, brand },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.status === 200) {
        toast.success("Brand And product Add successfully!");
        setSerialNumber(''); 
        setBrand(''); 
      }
    } catch (error) {
      console.error("Axios error:", error.response?.data);
      toast.error(error.response?.data?.message || "Error updating brand!");
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="brand-serialnumber max-w-xl mx-auto p-6 bg-black rounded-lg shadow-lg mt-[150px]  ">
      <h2 className="text-3xl font-semibold text-center mb-6">Add Product And Brand Name by Serial Number</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="serialNumber" className="block text-lg font-medium text-white-700">
            Serial Number
          </label>
          <input
            type="text"
            id="serialNumber"
            placeholder='Enter Serial Number'
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            required
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="brand" className="block text-lg font-medium text-white-700">
            Brand Name
          </label>
          <input
            type="text"
            id="brand"
            placeholder='Enter Name brand'
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 text-white font-semibold rounded-md focus:outline-none ${loading ? 'bg-gray-400' : 'bg-[#5f2476] hover:bg-[#5f2476]'} transition duration-300`}
        >
          {loading ? 'loading...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;
