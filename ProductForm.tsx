import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { Product } from '../../utils/types';
import { format } from 'date-fns';

interface ProductFormProps {
  product?: Product;
  onSubmit: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    manufacturer: '',
    batchNumber: '',
    price: 0,
    costPrice: 0,
    stock: 0,
    expiryDate: format(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), // Default to 1 year from now
    location: '',
    minStockLevel: 10,
    image: ''
  });
  
  // Load product data if editing
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        category: product.category,
        manufacturer: product.manufacturer,
        batchNumber: product.batchNumber,
        price: product.price,
        costPrice: product.costPrice,
        stock: product.stock,
        expiryDate: product.expiryDate,
        location: product.location,
        minStockLevel: product.minStockLevel,
        image: product.image || ''
      });
    }
  }, [product]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {product ? 'Edit Product' : 'Add New Product'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product Info */}
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Product Name*
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category*
              </label>
              <input
                type="text"
                name="category"
                id="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700">
                Manufacturer*
              </label>
              <input
                type="text"
                name="manufacturer"
                id="manufacturer"
                value={formData.manufacturer}
                onChange={handleChange}
                required
                className="mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          {/* Inventory Info */}
          <div className="space-y-4">
            <div>
              <label htmlFor="batchNumber" className="block text-sm font-medium text-gray-700">
                Batch Number*
              </label>
              <input
                type="text"
                name="batchNumber"
                id="batchNumber"
                value={formData.batchNumber}
                onChange={handleChange}
                required
                className="mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price*
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    className="focus:ring-teal-500 focus:border-teal-500 block w-full pl-7 pr-3 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="costPrice" className="block text-sm font-medium text-gray-700">
                  Cost Price*
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    name="costPrice"
                    id="costPrice"
                    min="0"
                    step="0.01"
                    value={formData.costPrice}
                    onChange={handleChange}
                    required
                    className="focus:ring-teal-500 focus:border-teal-500 block w-full pl-7 pr-3 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                  Stock Quantity*
                </label>
                <input
                  type="number"
                  name="stock"
                  id="stock"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  className="mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="minStockLevel" className="block text-sm font-medium text-gray-700">
                  Min Stock Level*
                </label>
                <input
                  type="number"
                  name="minStockLevel"
                  id="minStockLevel"
                  min="0"
                  value={formData.minStockLevel}
                  onChange={handleChange}
                  required
                  className="mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                Expiry Date*
              </label>
              <input
                type="date"
                name="expiryDate"
                id="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                required
                className="mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location*
              </label>
              <input
                type="text"
                name="location"
                id="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Image URL
          </label>
          <input
            type="text"
            name="image"
            id="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
          {formData.image && (
            <div className="mt-2">
              <img 
                src={formData.image} 
                alt="Product preview" 
                className="h-24 w-24 object-cover rounded border border-gray-300" 
              />
            </div>
          )}
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {product ? 'Update Product' : 'Add Product'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;