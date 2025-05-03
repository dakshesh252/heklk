import Database from 'better-sqlite3';
import { join } from 'path';

const db = new Database('C:\\Users\\DAKSHESH P SINGH\\Desktop\\project\\mine.db');

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    manufacturer TEXT NOT NULL,
    batchNumber TEXT NOT NULL,
    price REAL NOT NULL CHECK (price >= 0),
    costPrice REAL NOT NULL CHECK (costPrice >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    expiryDate TEXT NOT NULL,
    location TEXT NOT NULL,
    minStockLevel INTEGER NOT NULL DEFAULT 0,
    image TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS suppliers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    contactPerson TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    status TEXT CHECK (status IN ('active', 'inactive')) NOT NULL,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sales (
    id TEXT PRIMARY KEY,
    invoiceNumber TEXT UNIQUE NOT NULL,
    totalAmount REAL NOT NULL CHECK (totalAmount >= 0),
    discount REAL NOT NULL DEFAULT 0 CHECK (discount >= 0),
    tax REAL NOT NULL DEFAULT 0 CHECK (tax >= 0),
    finalAmount REAL NOT NULL CHECK (finalAmount >= 0),
    customerName TEXT NOT NULL,
    customerPhone TEXT,
    paymentMethod TEXT CHECK (paymentMethod IN ('cash', 'card', 'upi')) NOT NULL,
    status TEXT CHECK (status IN ('completed', 'pending', 'cancelled')) NOT NULL,
    date TEXT NOT NULL,
    cashierId TEXT NOT NULL,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sale_items (
    id TEXT PRIMARY KEY,
    saleId TEXT NOT NULL,
    productId TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unitPrice REAL NOT NULL CHECK (unitPrice >= 0),
    totalPrice REAL NOT NULL CHECK (totalPrice >= 0),
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (saleId) REFERENCES sales(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE RESTRICT
  );

  CREATE TABLE IF NOT EXISTS supplier_products (
    supplierId TEXT NOT NULL,
    productId TEXT NOT NULL,
    PRIMARY KEY (supplierId, productId),
    FOREIGN KEY (supplierId) REFERENCES suppliers(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
  CREATE INDEX IF NOT EXISTS idx_products_manufacturer ON products(manufacturer);
  CREATE INDEX IF NOT EXISTS idx_products_expiry_date ON products(expiryDate);
  CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(date);
  CREATE INDEX IF NOT EXISTS idx_sales_cashier_id ON sales(cashierId);
  CREATE INDEX IF NOT EXISTS idx_sale_items_sale_id ON sale_items(saleId);
  CREATE INDEX IF NOT EXISTS idx_sale_items_product_id ON sale_items(productId);
`);

// Helper functions for CRUD operations
export const dbOperations = {
  // Products
  getAllProducts: () => {
    return db.prepare('SELECT * FROM products').all();
  },
  
  getProductById: (id: string) => {
    return db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  },
  
  createProduct: (product: any) => {
    const stmt = db.prepare(`
      INSERT INTO products (
        id, name, description, category, manufacturer, batchNumber,
        price, costPrice, stock, expiryDate, location, minStockLevel, image
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      product.id,
      product.name,
      product.description,
      product.category,
      product.manufacturer,
      product.batchNumber,
      product.price,
      product.costPrice,
      product.stock,
      product.expiryDate,
      product.location,
      product.minStockLevel,
      product.image
    );
  },

  updateProduct: (product: any) => {
    const stmt = db.prepare(`
      UPDATE products 
      SET name = ?, description = ?, category = ?, manufacturer = ?,
          batchNumber = ?, price = ?, costPrice = ?, stock = ?,
          expiryDate = ?, location = ?, minStockLevel = ?, image = ?,
          updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    return stmt.run(
      product.name,
      product.description,
      product.category,
      product.manufacturer,
      product.batchNumber,
      product.price,
      product.costPrice,
      product.stock,
      product.expiryDate,
      product.location,
      product.minStockLevel,
      product.image,
      product.id
    );
  },

  deleteProduct: (id: string) => {
    return db.prepare('DELETE FROM products WHERE id = ?').run(id);
  },

  // Suppliers
  getAllSuppliers: () => {
    return db.prepare('SELECT * FROM suppliers').all();
  },

  createSupplier: (supplier: any) => {
    const stmt = db.prepare(`
      INSERT INTO suppliers (
        id, name, contactPerson, email, phone, address, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      supplier.id,
      supplier.name,
      supplier.contactPerson,
      supplier.email,
      supplier.phone,
      supplier.address,
      supplier.status
    );
  },

  // Sales
  getAllSales: () => {
    return db.prepare('SELECT * FROM sales').all();
  },

  createSale: (sale: any, items: any[]) => {
    const saleStmt = db.prepare(`
      INSERT INTO sales (
        id, invoiceNumber, totalAmount, discount, tax, finalAmount,
        customerName, customerPhone, paymentMethod, status, date, cashierId
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const itemStmt = db.prepare(`
      INSERT INTO sale_items (
        id, saleId, productId, quantity, unitPrice, totalPrice
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);

    db.transaction(() => {
      saleStmt.run(
        sale.id,
        sale.invoiceNumber,
        sale.totalAmount,
        sale.discount,
        sale.tax,
        sale.finalAmount,
        sale.customerName,
        sale.customerPhone,
        sale.paymentMethod,
        sale.status,
        sale.date,
        sale.cashierId
      );

      for (const item of items) {
        itemStmt.run(
          item.id,
          sale.id,
          item.productId,
          item.quantity,
          item.unitPrice,
          item.totalPrice
        );
      }
    })();
  }
};

export default db;