import { Product, Supplier, Sale, User, Alert, DashboardStats } from './types';
import { format, add, sub } from 'date-fns';

// Mock Products
export const products: Product[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    description: 'Pain reliever and fever reducer',
    category: 'Analgesics',
    manufacturer: 'MediPharm',
    batchNumber: 'BAT2023001',
    price: 5.99,
    costPrice: 3.50,
    stock: 120,
    expiryDate: format(add(new Date(), { months: 12 }), 'yyyy-MM-dd'),
    location: 'Shelf A1',
    minStockLevel: 30,
    image: 'https://images.pexels.com/photos/593451/pexels-photo-593451.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    createdAt: format(sub(new Date(), { days: 60 }), 'yyyy-MM-dd'),
    updatedAt: format(sub(new Date(), { days: 30 }), 'yyyy-MM-dd'),
  },
  {
    id: '2',
    name: 'Amoxicillin 250mg',
    description: 'Antibiotic for bacterial infections',
    category: 'Antibiotics',
    manufacturer: 'PharmaCure',
    batchNumber: 'BAT2023002',
    price: 12.50,
    costPrice: 7.25,
    stock: 85,
    expiryDate: format(add(new Date(), { months: 10 }), 'yyyy-MM-dd'),
    location: 'Shelf B2',
    minStockLevel: 25,
    image: 'https://images.pexels.com/photos/139398/pexels-photo-139398.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    createdAt: format(sub(new Date(), { days: 90 }), 'yyyy-MM-dd'),
    updatedAt: format(sub(new Date(), { days: 45 }), 'yyyy-MM-dd'),
  },
  {
    id: '3',
    name: 'Vitamin C 1000mg',
    description: 'Immune system support supplement',
    category: 'Vitamins',
    manufacturer: 'NutriBest',
    batchNumber: 'BAT2023003',
    price: 8.99,
    costPrice: 4.50,
    stock: 15,
    expiryDate: format(add(new Date(), { months: 18 }), 'yyyy-MM-dd'),
    location: 'Shelf C3',
    minStockLevel: 20,
    image: 'https://images.pexels.com/photos/4031440/pexels-photo-4031440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    createdAt: format(sub(new Date(), { days: 120 }), 'yyyy-MM-dd'),
    updatedAt: format(sub(new Date(), { days: 60 }), 'yyyy-MM-dd'),
  },
  {
    id: '4',
    name: 'Insulin Glargine 100u/ml',
    description: 'Long-acting insulin for diabetes management',
    category: 'Diabetes',
    manufacturer: 'DiabeCare',
    batchNumber: 'BAT2023004',
    price: 45.99,
    costPrice: 30.75,
    stock: 50,
    expiryDate: format(add(new Date(), { months: 6 }), 'yyyy-MM-dd'),
    location: 'Cold Storage R1',
    minStockLevel: 15,
    image: 'https://images.pexels.com/photos/360622/pexels-photo-360622.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    createdAt: format(sub(new Date(), { days: 45 }), 'yyyy-MM-dd'),
    updatedAt: format(sub(new Date(), { days: 20 }), 'yyyy-MM-dd'),
  },
  {
    id: '5',
    name: 'Ibuprofen 400mg',
    description: 'Anti-inflammatory pain reliever',
    category: 'Analgesics',
    manufacturer: 'PainAway',
    batchNumber: 'BAT2023005',
    price: 7.50,
    costPrice: 4.25,
    stock: 95,
    expiryDate: format(add(new Date(), { months: 15 }), 'yyyy-MM-dd'),
    location: 'Shelf A2',
    minStockLevel: 25,
    image: 'https://images.pexels.com/photos/159211/headache-pain-pills-medication-159211.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    createdAt: format(sub(new Date(), { days: 75 }), 'yyyy-MM-dd'),
    updatedAt: format(sub(new Date(), { days: 40 }), 'yyyy-MM-dd'),
  },
];

// Mock Suppliers
export const suppliers: Supplier[] = [
  {
    id: '1',
    name: 'MediPharm Distributors',
    contactPerson: 'John Smith',
    email: 'john@medipharm.com',
    phone: '+1234567890',
    address: '123 Pharmacy St, Medical City, MC 12345',
    products: ['1', '5'],
    status: 'active',
    createdAt: format(sub(new Date(), { months: 6 }), 'yyyy-MM-dd'),
  },
  {
    id: '2',
    name: 'PharmaCure Supplies',
    contactPerson: 'Lisa Johnson',
    email: 'lisa@pharmacure.com',
    phone: '+0987654321',
    address: '456 Health Ave, Wellness Town, WT 67890',
    products: ['2'],
    status: 'active',
    createdAt: format(sub(new Date(), { months: 8 }), 'yyyy-MM-dd'),
  },
  {
    id: '3',
    name: 'NutriBest Inc.',
    contactPerson: 'Mark Davis',
    email: 'mark@nutribest.com',
    phone: '+1122334455',
    address: '789 Vitamin Rd, Supplement City, SC 54321',
    products: ['3'],
    status: 'active',
    createdAt: format(sub(new Date(), { months: 4 }), 'yyyy-MM-dd'),
  },
  {
    id: '4',
    name: 'DiabeCare Medical',
    contactPerson: 'Sarah Wilson',
    email: 'sarah@diabecare.com',
    phone: '+5566778899',
    address: '321 Glucose Blvd, Insulin Park, IP 98765',
    products: ['4'],
    status: 'inactive',
    createdAt: format(sub(new Date(), { months: 10 }), 'yyyy-MM-dd'),
  },
];

// Mock Sales
export const sales: Sale[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2023-001',
    items: [
      {
        productId: '1',
        productName: 'Paracetamol 500mg',
        quantity: 2,
        unitPrice: 5.99,
        totalPrice: 11.98
      },
      {
        productId: '3',
        productName: 'Vitamin C 1000mg',
        quantity: 1,
        unitPrice: 8.99,
        totalPrice: 8.99
      }
    ],
    totalAmount: 20.97,
    discount: 2.00,
    tax: 1.90,
    finalAmount: 20.87,
    customerName: 'Alex Brown',
    customerPhone: '+1234509876',
    paymentMethod: 'cash',
    status: 'completed',
    date: format(sub(new Date(), { days: 1 }), 'yyyy-MM-dd'),
    cashierId: '2',
  },
  {
    id: '2',
    invoiceNumber: 'INV-2023-002',
    items: [
      {
        productId: '2',
        productName: 'Amoxicillin 250mg',
        quantity: 1,
        unitPrice: 12.50,
        totalPrice: 12.50
      }
    ],
    totalAmount: 12.50,
    discount: 0,
    tax: 1.25,
    finalAmount: 13.75,
    customerName: 'Maria Garcia',
    paymentMethod: 'card',
    status: 'completed',
    date: format(sub(new Date(), { days: 2 }), 'yyyy-MM-dd'),
    cashierId: '3',
  },
  {
    id: '3',
    invoiceNumber: 'INV-2023-003',
    items: [
      {
        productId: '4',
        productName: 'Insulin Glargine 100u/ml',
        quantity: 1,
        unitPrice: 45.99,
        totalPrice: 45.99
      }
    ],
    totalAmount: 45.99,
    discount: 5.00,
    tax: 4.10,
    finalAmount: 45.09,
    customerName: 'James Wilson',
    customerPhone: '+5551234567',
    paymentMethod: 'upi',
    status: 'completed',
    date: format(new Date(), 'yyyy-MM-dd'),
    cashierId: '2',
  },
];

// Mock Users
export const users: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@medstore.com',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    createdAt: format(sub(new Date(), { years: 1 }), 'yyyy-MM-dd'),
  },
  {
    id: '2',
    name: 'Manager User',
    email: 'manager@medstore.com',
    role: 'manager',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    createdAt: format(sub(new Date(), { months: 8 }), 'yyyy-MM-dd'),
  },
  {
    id: '3',
    name: 'Cashier User',
    email: 'cashier@medstore.com',
    role: 'cashier',
    avatar: 'https://images.pexels.com/photos/1844547/pexels-photo-1844547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    createdAt: format(sub(new Date(), { months: 3 }), 'yyyy-MM-dd'),
  },
];

// Mock Alerts
export const alerts: Alert[] = [
  {
    id: '1',
    type: 'low-stock',
    message: 'Vitamin C 1000mg is running low on stock (15 remaining)',
    productId: '3',
    read: false,
    createdAt: format(sub(new Date(), { days: 1 }), 'yyyy-MM-dd'),
  },
  {
    id: '2',
    type: 'expiry',
    message: 'Insulin Glargine 100u/ml will expire in 6 months',
    productId: '4',
    read: false,
    createdAt: format(sub(new Date(), { days: 2 }), 'yyyy-MM-dd'),
  },
  {
    id: '3',
    type: 'system',
    message: 'System backup completed successfully',
    read: true,
    createdAt: format(sub(new Date(), { days: 3 }), 'yyyy-MM-dd'),
  },
];

// Mock Dashboard Stats
export const dashboardStats: DashboardStats = {
  totalSales: 3,
  totalProducts: 5,
  lowStockProducts: 1,
  expiringProducts: 1,
  revenueToday: 45.09,
  revenuePrevDay: 20.87,
  revenueThisMonth: 79.71,
  revenuePrevMonth: 256.35,
};

// Mock sales data for charts
export const salesChartData = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 4500 },
  { name: 'May', sales: 6000 },
  { name: 'Jun', sales: 5500 },
  { name: 'Jul', sales: 7000 },
  { name: 'Aug', sales: 6500 },
  { name: 'Sep', sales: 8000 },
  { name: 'Oct', sales: 7500 },
  { name: 'Nov', sales: 9000 },
  { name: 'Dec', sales: 8500 },
];

// Mock inventory data for charts
export const inventoryCategoryData = [
  { name: 'Analgesics', value: 215 },
  { name: 'Antibiotics', value: 85 },
  { name: 'Vitamins', value: 15 },
  { name: 'Diabetes', value: 50 },
  { name: 'Other', value: 150 },
];