import {pool} from "../config/db.js";
const findBySku = async (req) =>{
    const [rows]= await pool.query("SELECT * FROM products WHERE sku = ?",[req.params.sku]);
    return rows[0];
}


export {findBySku};
