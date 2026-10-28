import pool from "../config/db.js";
import {findBySku} from "../services/ProductModel.js";
const getProductBySku = async (req,res) =>{
        const product = await findBySku(req);
        if(!product){
        return res.status(404).json({message: "Product not found"});
    }
    res.status(200).json(product);
}

const getProducts = async (req, res) => {
  // Validate pagination parameters
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(
    100,
    Math.max(1, parseInt(req.query.limit, 10) || 10)
  );
  const offset = (page - 1) * limit;

  const search = (req.query.search || "").trim();

  let whereClause = "";
  const filterParams = [];

  if (search) {
    const pattern = `%${search}%`;

    whereClause = "WHERE sku LIKE ? OR name LIKE ?";
    filterParams.push(pattern, pattern);
  }

  try {
    // Count ALL matching products, before pagination
    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total
       FROM products
       ${whereClause}`,
      filterParams
    );

    const totalProducts = Number(countRows[0].total);
    const totalPages = Math.ceil(totalProducts / limit);

    // Fetch only the requested page
    const [rows] = await pool.query(
      `SELECT *
       FROM products
       ${whereClause}
       ORDER BY id ASC
       LIMIT ? OFFSET ?`,
      [...filterParams, limit, offset]
    );

    return res.status(200).json({
      message: "Data retrieved successfully",
      rows,
      pagination: {
        page,
        limit,
        totalProducts,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (err) {
    console.error("Error retrieving products:", err);

    return res.status(500).json({
      message: "Failed to retrieve products",
    });
  }
};

        
     
        // const searchQuery = req.query.search;
        // const [rows] = await pool.query("SELECT * FROM products WhERE sku LIKE %?% OR name LIKE %?% ORDER BY name, id LIMIT ? OFFSET ? ",[searchQuery,searchQuery,limit,offset]);
        // const [searchCount] = await pool.query("SELECT COUNT(*) AS total FROM products WHERE sku LIKE %?% OR name LIKE %?%",[searchQuery,searchQuery])
       
    


const createProduct = async (req,res) =>{
    const {sku, name, price, stock, low_stock_threshold} = req.body;
    try{
        const [result] = await pool.query("INSERT INTO products (sku, name, price, stock, low_stock_threshold) VALUES (?, ?, ?, ?, ?)", [sku, name, price, stock || 0, low_stock_threshold || 5]);
        res.status(201).json({message: "Product created successfully", productId: result.insertId});
    } catch (err) {
        console.error("Error creating product:", err);
        res.status(500).json({message: "Error creating product"});
    }
    
}

const updateProduct = async (req,res) =>{
    const {sku} = req.params;
    const {name, price, stock, low_stock_threshold} = req.body;
    try{
        const [result] = await pool.query("UPDATE products SET name = ?, price = ?, stock = ?, low_stock_threshold = ? WHERE sku = ?", [name, price, stock, low_stock_threshold, sku]);
        if(result.affectedRows === 0){
            return res.status(404).json({message: "Product not found"});
        }
        res.status(200).json({message: "Product updated successfully"});
    } catch (err) {
        console.error("Error updating product:", err);
        res.status(500).json({message: "Error updating product"});
    }
}

const deleteProduct = async (req,res) =>{
    const {sku} = req.params;
    try{
        const [result] = await pool.query("DELETE FROM products WHERE sku = ?", sku);
        if(result.affectedRows === 0){
            return res.status(404).json({message: "Product not found"});
        }
        res.status(200).json({message: "Product deleted successfully"});
    } catch (err) {
        console.error("Error deleting product:", err);
        res.status(500).json({message: "Error deleting product"});
    }

}
const getAllLowStockProducts = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM products WHERE stock <= low_stock_threshold");
        res.status(200).json(rows);
    } catch (err) {
        console.error("Error fetching low stock products:", err);
        res.status(500).json({message: "Error fetching low stock products"});
    }
}
export {getProductBySku, createProduct, updateProduct,deleteProduct, getAllLowStockProducts,getProducts};