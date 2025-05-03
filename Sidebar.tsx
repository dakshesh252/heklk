import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Truck, 
  BarChart3, 
  Settings, 
  X, 
  Pill
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { user } = useAuth();
  
  return (
    <>
      {/* Mobile sidebar backdrop */}
      <div 
        className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity md:hidden ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-teal-700 text-white transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto md:h-screen ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-4 border-b border-teal-600">
          <div className="flex items-center space-x-2">
            <Pill size={24} className="text-white" />
            <span className="text-xl font-bold">MedStore</span>
          </div>
          <button
            className="p-1 text-teal-300 hover:text-white md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-teal-600">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-teal-600 overflow-hidden">
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-lg font-semibold">
                  {user?.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs text-teal-300 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-2">
          <ul className="space-y-1">
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `flex items-center px-4 py-3 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-teal-600 text-white' 
                      : 'text-teal-100 hover:bg-teal-600'
                  }`
                }
              >
                <LayoutDashboard size={18} className="mr-3" />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/inventory" 
                className={({ isActive }) => 
                  `flex items-center px-4 py-3 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-teal-600 text-white' 
                      : 'text-teal-100 hover:bg-teal-600'
                  }`
                }
              >
                <Package size={18} className="mr-3" />
                Inventory
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/sales" 
                className={({ isActive }) => 
                  `flex items-center px-4 py-3 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-teal-600 text-white' 
                      : 'text-teal-100 hover:bg-teal-600'
                  }`
                }
              >
                <ShoppingCart size={18} className="mr-3" />
                Sales
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/suppliers" 
                className={({ isActive }) => 
                  `flex items-center px-4 py-3 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-teal-600 text-white' 
                      : 'text-teal-100 hover:bg-teal-600'
                  }`
                }
              >
                <Truck size={18} className="mr-3" />
                Suppliers
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/reports" 
                className={({ isActive }) => 
                  `flex items-center px-4 py-3 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-teal-600 text-white' 
                      : 'text-teal-100 hover:bg-teal-600'
                  }`
                }
              >
                <BarChart3 size={18} className="mr-3" />
                Reports
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/settings" 
                className={({ isActive }) => 
                  `flex items-center px-4 py-3 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-teal-600 text-white' 
                      : 'text-teal-100 hover:bg-teal-600'
                  }`
                }
              >
                <Settings size={18} className="mr-3" />
                Settings
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;