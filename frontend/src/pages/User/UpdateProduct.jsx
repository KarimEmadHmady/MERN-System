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

    try {
        const response = await axios.put(
            `/api/products/update-brand`, // تعديل المسار هنا
            { serialnumber: serialNumber, brand }
          );
          

      if (response.status === 200) {
        toast.success('Brand updated successfully!');
      }
    } catch (error) {
      toast.error('Error updating brand!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-center mb-6">Update Brand by Serial Number</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="serialNumber" className="block text-lg font-medium text-gray-700">
            Serial Number
          </label>
          <input
            type="text"
            id="serialNumber"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            required
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="brand" className="block text-lg font-medium text-gray-700">
            Brand Name
          </label>
          <input
            type="text"
            id="brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 text-white font-semibold rounded-md focus:outline-none ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} transition duration-300`}
        >
          {loading ? 'Updating...' : 'Update Brand'}
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;
