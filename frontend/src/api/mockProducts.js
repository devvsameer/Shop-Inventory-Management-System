export const mockProducts = [
  { id: 1, sku: "WM-001", name: "Wireless Mouse", price: "499.00", stock: 20, low_stock_threshold: 5 },
  { id: 2, sku: "WM-002", name: "Wired Mouse", price: "249.00", stock: 35, low_stock_threshold: 10 },
  { id: 3, sku: "KB-001", name: "Mechanical Keyboard", price: "2499.00", stock: 3, low_stock_threshold: 5 },
  { id: 4, sku: "KB-002", name: "Membrane Keyboard", price: "699.00", stock: 15, low_stock_threshold: 5 },
  { id: 5, sku: "HD-001", name: "Gaming Headset", price: "1499.00", stock: 10, low_stock_threshold: 5 },
  { id: 6, sku: "HD-002", name: "Earbuds", price: "799.00", stock: 5, low_stock_threshold: 5 },
  { id: 7, sku: "PN-001", name: "Blue Pen", price: "10.00", stock: 200, low_stock_threshold: 50 },
  { id: 8, sku: "PN-002", name: "Black Pen", price: "10.00", stock: 40, low_stock_threshold: 50 },
  { id: 9, sku: "PN-003", name: "Gel Pen Pack", price: "120.50", stock: 0, low_stock_threshold: 10 },
  { id: 10, sku: "NB-001", name: "Notebook A4", price: "85.00", stock: 60, low_stock_threshold: 20 },
  { id: 11, sku: "NB-002", name: "Notebook A5", price: "55.00", stock: 18, low_stock_threshold: 20 },
  { id: 12, sku: "MN-001", name: "Monitor 24 inch", price: "8999.00", stock: 7, low_stock_threshold: 3 },
  { id: 13, sku: "MN-002", name: "Monitor 27 inch", price: "15999.00", stock: 2, low_stock_threshold: 3 },
  { id: 14, sku: "CB-001", name: "USB Cable 1m", price: "99.00", stock: 120, low_stock_threshold: 30 },
  { id: 15, sku: "CB-002", name: "HDMI Cable 2m", price: "199.00", stock: 25, low_stock_threshold: 10 },
  { id: 16, sku: "PW-001", name: "Power Bank 10000mAh", price: "1299.00", stock: 12, low_stock_threshold: 5 },
  { id: 17, sku: "PW-002", name: "Phone Charger 20W", price: "599.00", stock: 4, low_stock_threshold: 5 },
  { id: 18, sku: "SP-001", name: "Desk Lamp", price: "649.99", stock: 9, low_stock_threshold: 4 },
  { id: 19, sku: "SP-002", name: "Pen Stand", price: "75.00", stock: 30, low_stock_threshold: 10 },
  { id: 20, sku: "SP-003", name: "100% Cotton Cloth", price: "45.00", stock: 50, low_stock_threshold: 10 },
  { id: 21, sku: "SP-004", name: "Men's Wallet", price: "350.00", stock: 14, low_stock_threshold: 5 },
  { id: 22, sku: "ABC_01", name: "Underscore Test Item", price: "10.00", stock: 10, low_stock_threshold: 5 },
];

// Behaves like GET /products: search, stable sort, pagination.
export function mockGetProducts({ page = 1, limit =  10, search = "" } = {}) {


  const term = search.trim().toLowerCase();

  const filtered = mockProducts
    .filter(
      (p) =>
        !term ||
        p.name.toLowerCase().includes(term) ||
        p.sku.toLowerCase().includes(term)
    )
    .sort((a, b) => a.name.localeCompare(b.name) || a.id - b.id);

  const start = (page - 1) * limit;
  const rows = filtered.slice(start, start + limit);

  // Fake network delay so you can see the loading state.
  return new Promise((resolve) =>
    setTimeout(() => resolve({ rows, total: filtered.length, page, limit }), 400)
  );
}