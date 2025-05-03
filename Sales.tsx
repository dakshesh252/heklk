import React, { useState } from 'react';
import { ShoppingCart, Search, DollarSign, Printer, Trash2, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { Sale, Product, SaleItem } from '../utils/types';
import { sales as initialSales, products } from '../utils/data';
import Button from '../components/ui/Button';

const Sales: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>(initialSales);
  const [showNewSale, setShowNewSale] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Array<SaleItem & { product: Product }>>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi'>('cash');
  const [discount, setDiscount] = useState(0);
  
  const filteredSales = sales.filter(sale => 
    sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredProducts = products.filter(product => 
    product.stock > 0 && !selectedProducts.some(sp => sp.productId === product.id)
  );
  
  const addProductToSale = (product: Product) => {
    setSelectedProducts([
      ...selectedProducts,
      {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        unitPrice: product.price,
        totalPrice: product.price,
        product
      }
    ]);
  };
  
  const removeProductFromSale = (index: number) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };
  
  const updateProductQuantity = (index: number, quantity: number) => {
    if (quantity < 1) return;
    
    const updatedProducts = [...selectedProducts];
    const item = updatedProducts[index];
    
    // Check if we have enough stock
    if (quantity > item.product.stock) {
      alert(`Only ${item.product.stock} units available in stock`);
      return;
    }
    
    updatedProducts[index] = {
      ...item,
      quantity,
      totalPrice: item.unitPrice * quantity
    };
    
    setSelectedProducts(updatedProducts);
  };
  
  const calculateSubtotal = () => {
    return selectedProducts.reduce((sum, item) => sum + item.totalPrice, 0);
  };
  
  const calculateTax = () => {
    return calculateSubtotal() * 0.1; // 10% tax
  };
  
  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() - discount;
  };
  
  const createSale = () => {
    if (selectedProducts.length === 0) {
      alert('Please add at least one product to the sale');
      return;
    }
    
    if (!customerName) {
      alert('Please enter customer name');
      return;
    }
    
    const newSale: Sale = {
      id: `${sales.length + 1}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(sales.length + 1).padStart(3, '0')}`,
      items: selectedProducts.map(({ product, ...item }) => item),
      totalAmount: calculateSubtotal(),
      tax: calculateTax(),
      discount,
      finalAmount: calculateTotal(),
      customerName,
      customerPhone: customerPhone || undefined,
      paymentMethod,
      status: 'completed',
      date: format(new Date(), 'yyyy-MM-dd'),
      cashierId: '1', // Hardcoded for demo
    };
    
    setSales([...sales, newSale]);
    
    // Reset form
    setSelectedProducts([]);
    setCustomerName('');
    setCustomerPhone('');
    setDiscount(0);
    setPaymentMethod('cash');
    setShowNewSale(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <ShoppingCart className="mr-2 text-teal-600" size={24} />
          <h1 className="text-2xl font-bold text-gray-800">Sales Management</h1>
        </div>
        
        {!showNewSale ? (
          <Button 
            variant="primary" 
            leftIcon={<DollarSign size={16} />}
            onClick={() => setShowNewSale(true)}
          >
            New Sale
          </Button>
        ) : (
          <Button 
            variant="outline"
            onClick={() => setShowNewSale(false)}
          >
            Cancel
          </Button>
        )}
      </div>
      
      {showNewSale ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">New Sale</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Selection */}
            <div>
              <h3 className="text-lg font-medium mb-4">Add Products</h3>
              
              <div className="mb-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm"
                    placeholder="Search available products..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="max-h-60 overflow-y-auto mb-4 border border-gray-200 rounded-md">
                <ul className="divide-y divide-gray-200">
                  {filteredProducts.length === 0 ? (
                    <li className="px-4 py-3 text-sm text-gray-500">
                      No products available or all products added
                    </li>
                  ) : (
                    filteredProducts.map(product => (
                      <li key={product.id} className="px-4 py-3 hover:bg-gray-50">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-gray-800">{product.name}</p>
                            <p className="text-xs text-gray-500">Stock: {product.stock} | ${product.price.toFixed(2)}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => addProductToSale(product)}
                          >
                            Add
                          </Button>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
            
            {/* Order Summary */}
            <div>
              <h3 className="text-lg font-medium mb-4">Order Summary</h3>
              
              {selectedProducts.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-md border border-gray-200">
                  <p className="text-gray-500">No products added yet</p>
                </div>
              ) : (
                <div className="mb-4 max-h-60 overflow-y-auto border border-gray-200 rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {selectedProducts.map((item, index) => (
                      <li key={index} className="px-4 py-3">
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">{item.productName}</p>
                            <p className="text-xs text-gray-500">${item.unitPrice.toFixed(2)} each</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              className="text-gray-400 hover:text-gray-600"
                              onClick={() => updateProductQuantity(index, item.quantity - 1)}
                            >
                              -
                            </button>
                            <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                            <button
                              className="text-gray-400 hover:text-gray-600"
                              onClick={() => updateProductQuantity(index, item.quantity + 1)}
                            >
                              +
                            </button>
                            <span className="text-sm font-medium w-16 text-right">
                              ${item.totalPrice.toFixed(2)}
                            </span>
                            <button
                              onClick={() => removeProductFromSale(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Price Calculations */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="font-medium">${calculateTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount</span>
                  <div className="flex items-center">
                    <span className="mr-2">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                      className="w-16 border border-gray-300 rounded px-2 py-1 text-right text-sm"
                    />
                  </div>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="font-medium">Total</span>
                  <span className="font-bold text-lg">${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
              
              {/* Customer Info */}
              <div className="space-y-4 mb-4">
                <div>
                  <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">
                    Customer Name*
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    className="mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700">
                    Customer Phone
                  </label>
                  <input
                    type="text"
                    id="customerPhone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
                    Payment Method
                  </label>
                  <select
                    id="paymentMethod"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'card' | 'upi')}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="upi">UPI</option>
                  </select>
                </div>
              </div>
              
              <Button 
                variant="primary" 
                fullWidth 
                leftIcon={<ArrowRight size={16} />}
                onClick={createSale}
                disabled={selectedProducts.length === 0 || !customerName}
              >
                Complete Sale
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="relative flex-grow max-w-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm"
                  placeholder="Search sales..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSales.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                      No sales found
                    </td>
                  </tr>
                ) : (
                  filteredSales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{sale.invoiceNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{sale.customerName}</div>
                        <div className="text-xs text-gray-500">{sale.customerPhone || 'No phone'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {format(new Date(sale.date), 'MMM d, yyyy')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{sale.items.length}</div>
                        <div className="text-xs text-gray-500">
                          {sale.items.slice(0, 2).map(item => item.productName).join(', ')}
                          {sale.items.length > 2 && '...'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${sale.finalAmount.toFixed(2)}
                        </div>
                        {sale.discount > 0 && (
                          <div className="text-xs text-green-600">
                            Discount: ${sale.discount.toFixed(2)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 capitalize">
                          {sale.paymentMethod}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                          title="Print receipt"
                        >
                          <Printer size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;