import React from 'react';
import { Menu, Bell, Search, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { alerts } from '../../utils/data';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { logout } = useAuth();
  const unreadAlerts = alerts.filter(alert => !alert.read).length;
  
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 py-3 flex items-center justify-between">
        {/* Left: Hamburger menu (mobile) and search */}
        <div className="flex items-center space-x-4">
          <button
            className="text-gray-500 hover:text-gray-700 md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={24} />
          </button>
          
          <div className="hidden md:flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-md">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm w-40 lg:w-64"
            />
          </div>
        </div>
        
        {/* Right: Actions */}
        <div className="flex items-center space-x-4">
          {/* Notification bell */}
          <div className="relative">
            <button className="text-gray-500 hover:text-gray-700">
              <Bell size={20} />
              {unreadAlerts > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {unreadAlerts}
                </span>
              )}
            </button>
          </div>
          
          {/* Logout button */}
          <button 
            onClick={logout}
            className="flex items-center text-gray-500 hover:text-gray-700"
          >
            <LogOut size={20} />
            <span className="ml-2 hidden md:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;