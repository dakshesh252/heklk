export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  manufacturer: string;
  batchNumber: string;
  price: number;
  costPrice: number;
  stock: number;
  expiryDate: string;
  location: string;
  minStockLevel: number;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  products: string[];
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Sale {
  id: string;
  invoiceNumber: string;
  items: SaleItem[];
  totalAmount: number;
  discount: number;
  tax: number;
  finalAmount: number;
  customerName: string;
  customerPhone?: string;
  paymentMethod: 'cash' | 'card' | 'upi';
  status: 'completed' | 'pending' | 'cancelled';
  date: string;
  cashierId: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'cashier';
  avatar?: string;
  createdAt: string;
}

export interface Alert {
  id: string;
  type: 'low-stock' | 'expiry' | 'system';
  message: string;
  productId?: string;
  read: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalSales: number;
  totalProducts: number;
  lowStockProducts: number;
  expiringProducts: number;
  revenueToday: number;
  revenuePrevDay: number;
  revenueThisMonth: number;
  revenuePrevMonth: number;
}