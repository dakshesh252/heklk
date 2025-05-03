import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Shield, Bell, Database, Save } from 'lucide-react';
import Button from '../components/ui/Button';
import { users } from '../utils/data';
import { useAuth } from '../context/AuthContext';

enum SettingsTab {
  PROFILE = 'profile',
  USERS = 'users',
  NOTIFICATIONS = 'notifications',
  BACKUP = 'backup'
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>(SettingsTab.PROFILE);
  const { user, logout } = useAuth();
  
  // Profile settings state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm({ ...profileForm, [name]: value });
  };
  
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would make an API call to update the user profile
    alert('Profile updated successfully!');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <SettingsIcon className="mr-2 text-teal-600" size={24} />
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-gray-50 md:border-r border-gray-200">
            <nav className="p-4 space-y-1">
              <button
                className={`w-full flex items-center px-4 py-3 rounded-md transition-colors ${
                  activeTab === SettingsTab.PROFILE
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab(SettingsTab.PROFILE)}
              >
                <User size={18} className="mr-3" />
                Profile
              </button>
              
              {(user?.role === 'admin' || user?.role === 'manager') && (
                <button
                  className={`w-full flex items-center px-4 py-3 rounded-md transition-colors ${
                    activeTab === SettingsTab.USERS
                      ? 'bg-teal-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab(SettingsTab.USERS)}
                >
                  <Shield size={18} className="mr-3" />
                  Users & Permissions
                </button>
              )}
              
              <button
                className={`w-full flex items-center px-4 py-3 rounded-md transition-colors ${
                  activeTab === SettingsTab.NOTIFICATIONS
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab(SettingsTab.NOTIFICATIONS)}
              >
                <Bell size={18} className="mr-3" />
                Notifications
              </button>
              
              {user?.role === 'admin' && (
                <button
                  className={`w-full flex items-center px-4 py-3 rounded-md transition-colors ${
                    activeTab === SettingsTab.BACKUP
                      ? 'bg-teal-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab(SettingsTab.BACKUP)}
                >
                  <Database size={18} className="mr-3" />
                  Backup & Restore
                </button>
              )}
            </nav>
          </div>
          
          {/* Content */}
          <div className="flex-1 p-6">
            {activeTab === SettingsTab.PROFILE && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
                
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="flex flex-col md:flex-row md:space-x-4">
                    <div className="md:w-1/3 mb-4 md:mb-0">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                          {profileForm.avatar ? (
                            <img 
                              src={profileForm.avatar} 
                              alt={profileForm.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 text-3xl font-semibold">
                              {profileForm.name?.charAt(0)}
                            </div>
                          )}
                        </div>
                        
                        <div className="w-full">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Profile Picture URL
                          </label>
                          <input
                            type="text"
                            name="avatar"
                            value={profileForm.avatar}
                            onChange={handleProfileChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:w-2/3 space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={profileForm.name}
                          onChange={handleProfileChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={profileForm.email}
                          onChange={handleProfileChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                        />
                      </div>
                      
                      <div className="pt-4 border-t border-gray-200">
                        <h3 className="text-lg font-medium mb-3">Change Password</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                              Current Password
                            </label>
                            <input
                              type="password"
                              name="currentPassword"
                              id="currentPassword"
                              value={profileForm.currentPassword}
                              onChange={handleProfileChange}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                              New Password
                            </label>
                            <input
                              type="password"
                              name="newPassword"
                              id="newPassword"
                              value={profileForm.newPassword}
                              onChange={handleProfileChange}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              name="confirmPassword"
                              id="confirmPassword"
                              value={profileForm.confirmPassword}
                              onChange={handleProfileChange}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <Button 
                      variant="danger" 
                      type="button" 
                      onClick={logout}
                    >
                      Logout
                    </Button>
                    <Button 
                      variant="primary" 
                      type="submit"
                      leftIcon={<Save size={16} />}
                    >
                      Save Changes
                    </Button>
                  </div>
                </form>
              </div>
            )}
            
            {activeTab === SettingsTab.USERS && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Users & Permissions</h2>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                                {user.avatar ? (
                                  <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-500 font-medium">{user.name.charAt(0)}</span>
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.role === 'admin'
                                ? 'bg-purple-100 text-purple-800'
                                : user.role === 'manager'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                              Edit
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              Disable
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button 
                    variant="primary" 
                    leftIcon={<User size={16} />}
                  >
                    Add User
                  </Button>
                </div>
              </div>
            )}
            
            {activeTab === SettingsTab.NOTIFICATIONS && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Notification Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">System Notifications</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Low Stock Alerts</p>
                          <p className="text-xs text-gray-500">Get notified when products are running low</p>
                        </div>
                        <label className="flex items-center cursor-pointer">
                          <div className="relative">
                            <input type="checkbox" className="sr-only" defaultChecked />
                            <div className="block bg-gray-300 w-10 h-6 rounded-full"></div>
                            <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                          </div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Expiry Alerts</p>
                          <p className="text-xs text-gray-500">Get notified when products are nearing expiry</p>
                        </div>
                        <label className="flex items-center cursor-pointer">
                          <div className="relative">
                            <input type="checkbox" className="sr-only" defaultChecked />
                            <div className="block bg-gray-300 w-10 h-6 rounded-full"></div>
                            <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                          </div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Sales Reports</p>
                          <p className="text-xs text-gray-500">Get daily summary of sales</p>
                        </div>
                        <label className="flex items-center cursor-pointer">
                          <div className="relative">
                            <input type="checkbox" className="sr-only" />
                            <div className="block bg-gray-300 w-10 h-6 rounded-full"></div>
                            <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-medium mb-3">Email Notifications</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Send Daily Report</p>
                          <p className="text-xs text-gray-500">Daily summary of store activities</p>
                        </div>
                        <label className="flex items-center cursor-pointer">
                          <div className="relative">
                            <input type="checkbox" className="sr-only" defaultChecked />
                            <div className="block bg-gray-300 w-10 h-6 rounded-full"></div>
                            <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                          </div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Send Weekly Report</p>
                          <p className="text-xs text-gray-500">Weekly summary of store activities</p>
                        </div>
                        <label className="flex items-center cursor-pointer">
                          <div className="relative">
                            <input type="checkbox" className="sr-only" defaultChecked />
                            <div className="block bg-gray-300 w-10 h-6 rounded-full"></div>
                            <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button 
                    variant="primary" 
                    type="button"
                    leftIcon={<Save size={16} />}
                  >
                    Save Settings
                  </Button>
                </div>
              </div>
            )}
            
            {activeTab === SettingsTab.BACKUP && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Backup & Restore</h2>
                
                <div className="bg-gray-50 p-4 mb-6 rounded-md border border-gray-200">
                  <h3 className="text-md font-medium mb-2">System Information</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Last Backup:</span>
                    </div>
                    <div>
                      <span className="font-medium">October 15, 2023 (5 days ago)</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Database Size:</span>
                    </div>
                    <div>
                      <span className="font-medium">24.5 MB</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Version:</span>
                    </div>
                    <div>
                      <span className="font-medium">MedStore v1.0.0</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Backup Options</h3>
                    
                    <div className="space-y-4">
                      <div className="bg-white p-4 border border-gray-200 rounded-md">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Manual Backup</p>
                            <p className="text-xs text-gray-500">Create a backup of your data now</p>
                          </div>
                          <Button variant="primary" size="sm">
                            Create Backup
                          </Button>
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 border border-gray-200 rounded-md">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Scheduled Backups</p>
                            <p className="text-xs text-gray-500">Automatically create backups on a schedule</p>
                          </div>
                          <select className="form-select px-3 py-1.5 text-sm border border-gray-300 rounded-md">
                            <option value="daily">Daily</option>
                            <option value="weekly" selected>Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="never">Never</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-medium mb-3">Restore from Backup</h3>
                    
                    <div className="bg-white p-4 border border-gray-200 rounded-md">
                      <div className="flex flex-col space-y-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Choose a backup file to restore from</p>
                          <select className="form-select px-3 py-2 w-full text-sm border border-gray-300 rounded-md">
                            <option value="backup-20231015">October 15, 2023 (Auto)</option>
                            <option value="backup-20231008">October 8, 2023 (Auto)</option>
                            <option value="backup-20231001">October 1, 2023 (Manual)</option>
                          </select>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button variant="danger" size="sm">
                            Restore
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 bg-amber-50 p-3 rounded-md border border-amber-200">
                      <p className="text-sm text-amber-800">
                        <strong>Warning:</strong> Restoring from a backup will replace all current data. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;