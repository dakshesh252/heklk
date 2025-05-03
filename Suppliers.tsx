import React, { useState } from 'react';
import { Truck, Search, Plus, Edit, Trash2, Phone, Mail, MapPin } from 'lucide-react';
import { suppliers as initialSuppliers } from '../utils/data';
import { Supplier } from '../utils/types';
import Button from '../components/ui/Button';
import { format } from 'date-fns';

enum Mode {
  LIST,
  ADD,
  EDIT
}

const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [currentSupplier, setCurrentSupplier] = useState<Supplier | undefined>();
  const [mode, setMode] = useState<Mode>(Mode.LIST);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    status: 'active' as 'active' | 'inactive'
  });
  
  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAdd = () => {
    setFormData({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      status: 'active'
    });
    setMode(Mode.ADD);
  };
  
  const handleEdit = (supplier: Supplier) => {
    setCurrentSupplier(supplier);
    setFormData({
      name: supplier.name,
      contactPerson: supplier.contactPerson,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      status: supplier.status
    });
    setMode(Mode.EDIT);
  };
  
  const handleDelete = (supplierId: string) => {
    if (confirm('Are you sure you want to delete this supplier?')) {
      setSuppliers(suppliers.filter(s => s.id !== supplierId));
    }
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === Mode.ADD) {
      const newSupplier: Supplier = {
        id: `${suppliers.length + 1}`,
        products: [],
        createdAt: format(new Date(), 'yyyy-MM-dd'),
        ...formData
      };
      setSuppliers([...suppliers, newSupplier]);
    } else if (mode === Mode.EDIT && currentSupplier) {
      setSuppliers(suppliers.map(s => 
        s.id === currentSupplier.id 
          ? { ...currentSupplier, ...formData }
          : s
      ));
    }
    
    setMode(Mode.LIST);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Truck className="mr-2 text-teal-600" size={24} />
          <h1 className="text-2xl font-bold text-gray-800">Supplier Management</h1>
        </div>
        
        {mode === Mode.LIST && (
          <Button 
            variant="primary" 
            leftIcon={<Plus size={16} />}
            onClick={handleAdd}
          >
            Add Supplier
          </Button>
        )}
      </div>
      
      {mode === Mode.LIST ? (
        <>
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm"
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSuppliers.length === 0 ? (
              <div className="col-span-full text-center py-8 bg-gray-50 rounded-md border border-gray-200">
                <p className="text-gray-500">No suppliers found</p>
              </div>
            ) : (
              filteredSuppliers.map(supplier => (
                <div 
                  key={supplier.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{supplier.name}</h3>
                        <p className="text-sm text-gray-600">{supplier.contactPerson}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        supplier.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {supplier.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <div className="flex items-start">
                      <Phone size={16} className="mt-0.5 mr-2 text-gray-400 flex-shrink-0" />
                      <span className="text-sm">{supplier.phone}</span>
                    </div>
                    <div className="flex items-start">
                      <Mail size={16} className="mt-0.5 mr-2 text-gray-400 flex-shrink-0" />
                      <span className="text-sm">{supplier.email}</span>
                    </div>
                    <div className="flex items-start">
                      <MapPin size={16} className="mt-0.5 mr-2 text-gray-400 flex-shrink-0" />
                      <span className="text-sm">{supplier.address}</span>
                    </div>
                  </div>
                  
                  <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-end space-x-2">
                    <button
                      onClick={() => handleEdit(supplier)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(supplier.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">
            {mode === Mode.ADD ? 'Add New Supplier' : 'Edit Supplier'}
          </h2>
          
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Supplier Name*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  className="mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700">
                  Contact Person*
                </label>
                <input
                  type="text"
                  id="contactPerson"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleFormChange}
                  required
                  className="mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email*
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  className="mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone*
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  required
                  className="mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address*
              </label>
              <textarea
                id="address"
                name="address"
                rows={3}
                value={formData.address}
                onChange={handleFormChange}
                required
                className="mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button 
                variant="ghost" 
                type="button" 
                onClick={() => setMode(Mode.LIST)}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
              >
                {mode === Mode.ADD ? 'Add Supplier' : 'Update Supplier'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Suppliers;