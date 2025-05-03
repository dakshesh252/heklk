import React, { useState } from 'react';
import { Search, Filter, Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { Product } from '../../utils/types';
import Button from '../ui/Button';

interface InventoryListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onAdd: () => void;
}

const InventoryList: React.FC<InventoryListProps> = ({ 
  products, 
  onEdit, 
  onDelete,
  onAdd
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  
  // Get unique categories
  const categories = Array.from(new Set(products.map(p => p.category)));
  
  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory ? product.category === filterCategory : true;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div>
      {/* Header with search and filters */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 space-y-4 md:space-y-0">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="form-input pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2">
          <div className="relative">
            <select
              className="form-select pl-8 pr-8 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <Filter size={16} className="text-gray-400" />
            </div>
          </div>
          
          <Button
            variant="primary"
            leftIcon={<Plus size={16} />}
            onClick={onAdd}
          >
            Add Product
          </Button>
        </div>
      </div>
      
      {/* Product list table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Batch/Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiry
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        {product.image ? (
                          <div className="flex-shrink-0 h-10 w-10 rounded bg-gray-100 overflow-hidden">
                            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                          </div>
                        ) : (
                          <div className="flex-shrink-0 h-10 w-10 rounded bg-gray-100 flex items-center justify-center">
                            <span className="text-gray-500 text-xs">{product.name.substring(0, 2).toUpperCase()}</span>
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.batchNumber}</div>
                      <div className="text-sm text-gray-500">{product.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {product.stock <= product.minStockLevel && (
                          <AlertTriangle size={16} className="text-amber-500 mr-1" />
                        )}
                        <div className={`text-sm font-medium ${
                          product.stock <= product.minStockLevel ? 'text-amber-600' : 'text-gray-900'
                        }`}>
                          {product.stock}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${product.price.toFixed(2)}</div>
                      <div className="text-xs text-gray-500">Cost: ${product.costPrice.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${
                        new Date(product.expiryDate) <= new Date(new Date().setDate(new Date().getDate() + 30)) 
                          ? 'text-red-600' 
                          : 'text-gray-900'
                      }`}>
                        {format(new Date(product.expiryDate), 'MMM d, yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => onEdit(product)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryList;