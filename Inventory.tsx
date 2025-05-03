import React, { useState } from 'react';
import { Package, Plus } from 'lucide-react';
import InventoryList from '../components/inventory/InventoryList';
import ProductForm from '../components/inventory/ProductForm';
import { Product } from '../utils/types';
import { products as initialProducts } from '../utils/data';
import { format } from 'date-fns';

type ProductFormData = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

enum Mode {
  LIST,
  ADD,
  EDIT
}

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [currentProduct, setCurrentProduct] = useState<Product | undefined>();
  const [mode, setMode] = useState<Mode>(Mode.LIST);
  
  const handleAdd = () => {
    setCurrentProduct(undefined);
    setMode(Mode.ADD);
  };
  
  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setMode(Mode.EDIT);
  };
  
  const handleCancelForm = () => {
    setCurrentProduct(undefined);
    setMode(Mode.LIST);
  };
  
  const handleProductSubmit = (productData: ProductFormData) => {
    if (mode === Mode.ADD) {
      // Generate new product with mock ID and timestamps
      const newProduct: Product = {
        ...productData,
        id: `${products.length + 1}`,
        createdAt: format(new Date(), 'yyyy-MM-dd'),
        updatedAt: format(new Date(), 'yyyy-MM-dd'),
      };
      
      setProducts([...products, newProduct]);
    } else if (mode === Mode.EDIT && currentProduct) {
      // Update existing product
      setProducts(products.map(p => 
        p.id === currentProduct.id 
          ? { 
              ...p, 
              ...productData, 
              updatedAt: format(new Date(), 'yyyy-MM-dd') 
            }
          : p
      ));
    }
    
    // Return to list view
    setMode(Mode.LIST);
  };
  
  const handleDelete = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Package className="mr-2 text-teal-600" size={24} />
          <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
        </div>
        
        {mode === Mode.LIST && (
          <button
            onClick={handleAdd}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            <Plus size={16} className="mr-2" />
            Add Product
          </button>
        )}
      </div>
      
      {mode === Mode.LIST ? (
        <InventoryList 
          products={products} 
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAdd}
        />
      ) : (
        <ProductForm 
          product={currentProduct} 
          onSubmit={handleProductSubmit}
          onCancel={handleCancelForm}
        />
      )}
    </div>
  );
};

export default Inventory;