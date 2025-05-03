import React, { useState } from 'react';
import { 
  BarChart3, 
  Calendar,
  Download,
  TrendingUp,
  DollarSign,
  Package,
  ShoppingBag,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { products, sales, salesChartData } from '../utils/data';
import Button from '../components/ui/Button';

type ReportTimeframe = 'day' | 'week' | 'month' | 'year';

const Reports: React.FC = () => {
  const [timeframe, setTimeframe] = useState<ReportTimeframe>('month');
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  // Mock data for different report sections
  const topProducts = products
    .map(product => ({
      name: product.name,
      category: product.category,
      revenue: sales
        .flatMap(sale => sale.items)
        .filter(item => item.productId === product.id)
        .reduce((sum, item) => sum + item.totalPrice, 0)
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
  
  const categorySales = Object.entries(
    products.reduce((acc, product) => {
      const revenue = sales
        .flatMap(sale => sale.items)
        .filter(item => item.productId === product.id)
        .reduce((sum, item) => sum + item.totalPrice, 0);
      
      acc[product.category] = (acc[product.category] || 0) + revenue;
      return acc;
    }, {} as Record<string, number>)
  )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
  
  const paymentMethodData = Object.entries(
    sales.reduce((acc, sale) => {
      acc[sale.paymentMethod] = (acc[sale.paymentMethod] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));
  
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.finalAmount, 0);
  const totalProfit = sales.reduce((sum, sale) => {
    const profit = sale.items.reduce((itemSum, item) => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        return itemSum + (item.quantity * (product.price - product.costPrice));
      }
      return itemSum;
    }, 0);
    return sum + profit;
  }, 0);
  
  const avgOrderValue = totalRevenue / sales.length;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <BarChart3 className="mr-2 text-teal-600" size={24} />
          <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
        </div>
        
        <div className="flex space-x-2">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                timeframe === 'day'
                  ? 'bg-teal-100 text-teal-800'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300`}
              onClick={() => setTimeframe('day')}
            >
              Day
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium ${
                timeframe === 'week'
                  ? 'bg-teal-100 text-teal-800'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border-t border-b border-gray-300`}
              onClick={() => setTimeframe('week')}
            >
              Week
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium ${
                timeframe === 'month'
                  ? 'bg-teal-100 text-teal-800'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border-t border-b border-gray-300`}
              onClick={() => setTimeframe('month')}
            >
              Month
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                timeframe === 'year'
                  ? 'bg-teal-100 text-teal-800'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300`}
              onClick={() => setTimeframe('year')}
            >
              Year
            </button>
          </div>
          
          <Button
            variant="outline"
            leftIcon={<Download size={16} />}
          >
            Export
          </Button>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
            <span className="p-2 bg-blue-100 text-blue-600 rounded-full">
              <DollarSign size={14} />
            </span>
          </div>
          <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp size={14} className="text-green-500 mr-1" />
            <span className="text-green-500">8.2%</span>
            <span className="text-gray-500 ml-1">vs last {timeframe}</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-gray-500">Profit</h3>
            <span className="p-2 bg-green-100 text-green-600 rounded-full">
              <TrendingUp size={14} />
            </span>
          </div>
          <p className="text-2xl font-bold">${totalProfit.toFixed(2)}</p>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp size={14} className="text-green-500 mr-1" />
            <span className="text-green-500">12.5%</span>
            <span className="text-gray-500 ml-1">vs last {timeframe}</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
            <span className="p-2 bg-indigo-100 text-indigo-600 rounded-full">
              <ShoppingBag size={14} />
            </span>
          </div>
          <p className="text-2xl font-bold">{sales.length}</p>
          <div className="mt-2 flex items-center text-sm">
            <ChevronUp size={14} className="text-green-500 mr-1" />
            <span className="text-green-500">3.1%</span>
            <span className="text-gray-500 ml-1">vs last {timeframe}</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-gray-500">Avg. Order Value</h3>
            <span className="p-2 bg-amber-100 text-amber-600 rounded-full">
              <Package size={14} />
            </span>
          </div>
          <p className="text-2xl font-bold">${avgOrderValue.toFixed(2)}</p>
          <div className="mt-2 flex items-center text-sm">
            <ChevronDown size={14} className="text-red-500 mr-1" />
            <span className="text-red-500">1.8%</span>
            <span className="text-gray-500 ml-1">vs last {timeframe}</span>
          </div>
        </div>
      </div>
      
      {/* Sales Over Time Chart */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Sales Trend ({timeframe === 'day' ? 'Last 24 Hours' : 
                       timeframe === 'week' ? 'Last 7 Days' : 
                       timeframe === 'month' ? 'Last 30 Days' : 'Last 12 Months'})
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#0D9488" 
                strokeWidth={2}
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Top Products and Category Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Top Selling Products</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topProducts}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Bar dataKey="revenue" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Category Sales */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Sales by Category</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categorySales}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {categorySales.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Payment Methods and Inventory Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Payment Methods</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Inventory Status */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-800">Inventory Status Summary</h3>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Low Stock Items</span>
                  <span className="text-sm font-medium text-amber-600">{
                    products.filter(p => p.stock <= p.minStockLevel).length
                  } items</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-amber-500 h-2 rounded-full" 
                    style={{ width: `${(products.filter(p => p.stock <= p.minStockLevel).length / products.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Expiring Soon</span>
                  <span className="text-sm font-medium text-red-600">{
                    products.filter(p => 
                      new Date(p.expiryDate) <= new Date(new Date().setDate(new Date().getDate() + 90))
                    ).length
                  } items</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${(products.filter(p => 
                      new Date(p.expiryDate) <= new Date(new Date().setDate(new Date().getDate() + 90))
                    ).length / products.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Well Stocked</span>
                  <span className="text-sm font-medium text-green-600">{
                    products.filter(p => 
                      p.stock > p.minStockLevel && 
                      new Date(p.expiryDate) > new Date(new Date().setDate(new Date().getDate() + 90))
                    ).length
                  } items</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(products.filter(p => 
                      p.stock > p.minStockLevel && 
                      new Date(p.expiryDate) > new Date(new Date().setDate(new Date().getDate() + 90))
                    ).length / products.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-800 mb-2">Suggested Actions</h4>
                <ul className="space-y-2 text-sm">
                  {products.filter(p => p.stock <= p.minStockLevel).length > 0 && (
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mt-1.5 mr-2"></span>
                      <span>Order more inventory for {
                        products.filter(p => p.stock <= p.minStockLevel).slice(0, 2).map(p => p.name).join(', ')
                      }{products.filter(p => p.stock <= p.minStockLevel).length > 2 ? '...' : ''}</span>
                    </li>
                  )}
                  
                  {products.filter(p => 
                    new Date(p.expiryDate) <= new Date(new Date().setDate(new Date().getDate() + 90))
                  ).length > 0 && (
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-1.5 mr-2"></span>
                      <span>Consider promotions for soon-to-expire products</span>
                    </li>
                  )}
                  
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2"></span>
                    <span>Review top-selling products for restocking priorities</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;