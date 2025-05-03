import React from 'react';
import { 
  Package, 
  AlertCircle, 
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  ShoppingCart,
  Calendar,
  Clock
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  dashboardStats, 
  salesChartData, 
  inventoryCategoryData,
  alerts,
  products
} from '../utils/data';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  // Filter products that expire within the next 30 days or have low stock
  const criticalProducts = products.filter(product => 
    product.stock <= product.minStockLevel || 
    new Date(product.expiryDate) <= new Date(new Date().setDate(new Date().getDate() + 30))
  );
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500">
          {format(new Date(), 'MMMM d, yyyy')}
        </p>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Revenue */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-gray-500">Today's Revenue</h3>
            <span className="p-2 bg-blue-100 text-blue-600 rounded-full">
              <DollarSign size={14} />
            </span>
          </div>
          <p className="text-2xl font-bold">${dashboardStats.revenueToday.toFixed(2)}</p>
          <div className="mt-2 flex items-center text-sm">
            {dashboardStats.revenueToday > dashboardStats.revenuePrevDay ? (
              <>
                <TrendingUp size={14} className="text-green-500 mr-1" />
                <span className="text-green-500">
                  {(((dashboardStats.revenueToday - dashboardStats.revenuePrevDay) / dashboardStats.revenuePrevDay) * 100).toFixed(1)}%
                </span>
              </>
            ) : (
              <>
                <TrendingDown size={14} className="text-red-500 mr-1" />
                <span className="text-red-500">
                  {(((dashboardStats.prevDay - dashboardStats.revenueToday) / dashboardStats.prevDay) * 100).toFixed(1)}%
                </span>
              </>
            )}
            <span className="text-gray-500 ml-1">vs yesterday</span>
          </div>
        </div>
        
        {/* Total Products */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
            <span className="p-2 bg-green-100 text-green-600 rounded-full">
              <Package size={14} />
            </span>
          </div>
          <p className="text-2xl font-bold">{dashboardStats.totalProducts}</p>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-gray-500">
              {dashboardStats.lowStockProducts} low stock items
            </span>
          </div>
        </div>
        
        {/* Total Sales */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
            <span className="p-2 bg-indigo-100 text-indigo-600 rounded-full">
              <ShoppingCart size={14} />
            </span>
          </div>
          <p className="text-2xl font-bold">{dashboardStats.totalSales}</p>
          <div className="mt-2 flex items-center text-sm">
            <Activity size={14} className="text-gray-400 mr-1" />
            <span className="text-gray-500">
              Last 24 hours
            </span>
          </div>
        </div>
        
        {/* Expiring Products */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-gray-500">Expiring Items</h3>
            <span className="p-2 bg-orange-100 text-orange-600 rounded-full">
              <AlertCircle size={14} />
            </span>
          </div>
          <p className="text-2xl font-bold">{dashboardStats.expiringProducts}</p>
          <div className="mt-2 flex items-center text-sm">
            <Calendar size={14} className="text-gray-400 mr-1" />
            <span className="text-gray-500">
              Next 30 days
            </span>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Sales Overview</h3>
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
        
        {/* Inventory Category Chart */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Inventory by Category</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={inventoryCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {inventoryCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Alerts and Critical Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-800">Recent Alerts</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.length === 0 ? (
              <p className="p-4 text-gray-500 text-center">No alerts to display</p>
            ) : (
              alerts.map(alert => (
                <div key={alert.id} className={`p-4 ${!alert.read ? 'bg-blue-50' : ''}`}>
                  <div className="flex items-start">
                    <div className={`mt-1 mr-3 flex-shrink-0 p-1 rounded-full 
                      ${alert.type === 'low-stock' ? 'bg-yellow-100 text-yellow-500' : 
                        alert.type === 'expiry' ? 'bg-red-100 text-red-500' : 
                        'bg-blue-100 text-blue-500'}`}>
                      {alert.type === 'low-stock' ? (
                        <Package size={16} />
                      ) : alert.type === 'expiry' ? (
                        <Calendar size={16} />
                      ) : (
                        <AlertCircle size={16} />
                      )}
                    </div>
                    <div>
                      <p className={`text-sm ${!alert.read ? 'font-medium' : ''}`}>
                        {alert.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center">
                        <Clock size={12} className="mr-1" />
                        {format(new Date(alert.createdAt), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Critical Inventory Items */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-800">Critical Inventory Items</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {criticalProducts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-4 text-gray-500 text-center">
                      No critical items to display
                    </td>
                  </tr>
                ) : (
                  criticalProducts.map(product => (
                    <tr key={product.id}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-500">{product.category}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className={`text-sm font-medium ${
                          product.stock <= product.minStockLevel ? 'text-red-600' : 'text-gray-900'
                        }`}>
                          {product.stock}
                        </div>
                        <div className="text-xs text-gray-500">Min: {product.minStockLevel}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {format(new Date(product.expiryDate), 'MMM d, yyyy')}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {product.stock <= product.minStockLevel ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                            Low Stock
                          </span>
                        ) : new Date(product.expiryDate) <= new Date(new Date().setDate(new Date().getDate() + 30)) ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                            Expiring Soon
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            Good
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;