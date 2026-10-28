import express from "express";
import { ValidateSku ,ValidateProduct,ValidateProductUpdate,ValidataionListquery} from "../middleware/productMiddleware.js";
import {createProduct, getProductBySku,updateProduct,getAllLowStockProducts,deleteProduct,getProducts} from "../controllers/productController.js";
const router = express.Router();

router.post("/", ValidateProduct,createProduct); 

router.get("/low-stock", getAllLowStockProducts);
  
router.put("/:sku", ValidateProductUpdate, updateProduct);
router.delete("/:sku", ValidateSku, deleteProduct);
//get product by sku
router.get("/:sku",  ValidateSku, getProductBySku);
//...............


router.get("/", ValidataionListquery,getProducts );

export default router;