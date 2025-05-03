/*
  # Initial schema setup for medical store management system

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `category` (text)
      - `manufacturer` (text)
      - `batch_number` (text)
      - `price` (numeric)
      - `cost_price` (numeric)
      - `stock` (integer)
      - `expiry_date` (date)
      - `location` (text)
      - `min_stock_level` (integer)
      - `image` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `suppliers`
      - `id` (uuid, primary key)
      - `name` (text)
      - `contact_person` (text)
      - `email` (text)
      - `phone` (text)
      - `address` (text)
      - `status` (text)
      - `created_at` (timestamptz)

    - `sales`
      - `id` (uuid, primary key)
      - `invoice_number` (text)
      - `total_amount` (numeric)
      - `discount` (numeric)
      - `tax` (numeric)
      - `final_amount` (numeric)
      - `customer_name` (text)
      - `customer_phone` (text, nullable)
      - `payment_method` (text)
      - `status` (text)
      - `date` (date)
      - `cashier_id` (uuid references auth.users)
      - `created_at` (timestamptz)

    - `sale_items`
      - `id` (uuid, primary key)
      - `sale_id` (uuid references sales)
      - `product_id` (uuid references products)
      - `quantity` (integer)
      - `unit_price` (numeric)
      - `total_price` (numeric)
      - `created_at` (timestamptz)

    - `supplier_products`
      - `supplier_id` (uuid references suppliers)
      - `product_id` (uuid references products)
      - Primary key (supplier_id, product_id)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL,
  manufacturer text NOT NULL,
  batch_number text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  cost_price numeric NOT NULL CHECK (cost_price >= 0),
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  expiry_date date NOT NULL,
  location text NOT NULL,
  min_stock_level integer NOT NULL DEFAULT 0 CHECK (min_stock_level >= 0),
  image text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  contact_person text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  status text NOT NULL CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now()
);

-- Create sales table
CREATE TABLE IF NOT EXISTS sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text NOT NULL UNIQUE,
  total_amount numeric NOT NULL CHECK (total_amount >= 0),
  discount numeric NOT NULL DEFAULT 0 CHECK (discount >= 0),
  tax numeric NOT NULL DEFAULT 0 CHECK (tax >= 0),
  final_amount numeric NOT NULL CHECK (final_amount >= 0),
  customer_name text NOT NULL,
  customer_phone text,
  payment_method text NOT NULL CHECK (payment_method IN ('cash', 'card', 'upi')),
  status text NOT NULL CHECK (status IN ('completed', 'pending', 'cancelled')),
  date date NOT NULL,
  cashier_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create sale_items table
CREATE TABLE IF NOT EXISTS sale_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id uuid REFERENCES sales ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products ON DELETE RESTRICT NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price numeric NOT NULL CHECK (unit_price >= 0),
  total_price numeric NOT NULL CHECK (total_price >= 0),
  created_at timestamptz DEFAULT now()
);

-- Create supplier_products junction table
CREATE TABLE IF NOT EXISTS supplier_products (
  supplier_id uuid REFERENCES suppliers ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (supplier_id, product_id)
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_products ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated users to read products"
  ON products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read suppliers"
  ON suppliers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert suppliers"
  ON suppliers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update suppliers"
  ON suppliers FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read sales"
  ON sales FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert sales"
  ON sales FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update sales"
  ON sales FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read sale_items"
  ON sale_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert sale_items"
  ON sale_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read supplier_products"
  ON supplier_products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert supplier_products"
  ON supplier_products FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_manufacturer ON products(manufacturer);
CREATE INDEX IF NOT EXISTS idx_products_expiry_date ON products(expiry_date);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(date);
CREATE INDEX IF NOT EXISTS idx_sales_cashier_id ON sales(cashier_id);
CREATE INDEX IF NOT EXISTS idx_sale_items_sale_id ON sale_items(sale_id);
CREATE INDEX IF NOT EXISTS idx_sale_items_product_id ON sale_items(product_id);