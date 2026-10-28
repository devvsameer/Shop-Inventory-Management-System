import {body, query,param, validationResult } from 'express-validator'
import { findBySku } from '../services/ProductModel.js';
import pool from "../config/db.js";

const RESERVED_SKUS = ['LOW-STOCK'];

const ValidataionListquery = [
    query('search')
    .optional()
    .isString().withMessage('Search must be a string').bail()
    .trim()
    .isLength({min:1,max:100}).withMessage("String can't be empty and not more than 100 chars"),
    query("page")
    .optional()
    .isInt({min:1}).withMessage("Page number cant be less than 1"),//default 1
    query("limit")
    .optional()
    .isInt({min:1 , max : 100}).withMessage("limit number cant be less than 1 or more than 100"),  ///default 10

    (req,res,next)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }
        next(); 
    }    
]
const ValidateSku = [
    param('sku')
    .isString().withMessage('SKU must be a string').bail()
    .trim()
    .toUpperCase()
    .notEmpty().withMessage('SKU is required').bail()
    .isLength({min:3, max:100}).withMessage('SKU must be between 3 and 100 characters').bail()
    .matches(/^[A-Z0-9_-]+$/).withMessage('SKU can only contain letters, numbers, hyphens and underscores').bail()
    ,
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }
        next();
    }
]
const ValidateProduct = [
    body('name')
    .notEmpty().withMessage('Name is required').bail()
    .trim()
    .isString().withMessage('Name must be a string').bail()
    .isLength({min:3, max:100}).withMessage('Name must be between 3 and 100 characters').bail()
    ,

    
    
    body('sku')
    .isString().withMessage('SKU must be a string').bail()
    .trim()
    .toUpperCase()
    .notEmpty().withMessage('SKU is required').bail()
    .isLength({min:3, max:100}).withMessage('SKU must be between 3 and 100 characters').bail()
    .matches(/^[A-Z0-9_-]+$/).withMessage('SKU can only contain letters, numbers, hyphens and underscores').bail()
    .custom(value => {
        if (RESERVED_SKUS.includes(value)) {
            throw new Error('SKU is reserved');
        }
        return true;
    })
    .custom(async (value) => {
        const [rows] = await pool.query('SELECT sku FROM products WHERE sku = ?', [value]);
        if (rows.length > 0) {
            throw new Error('SKU already exists');
        }
    })
    ,
    


    body('price')
    .notEmpty().withMessage('Price is required').bail()
    .isFloat({ gt: 0, max: 99999999.99 }).withMessage('Price must be a decimal number').bail()
    .isLength({min:1, max:10}).withMessage('Price must be between 1 and 10 characters').bail()
    .isDecimal({ decimal_digits: '0,2' }).withMessage('Price can have at most 2 decimal places'),
    
    
    body('stock')
    .optional()
    // .notEmpty().withMessage('Stock is required')
    .isInt().withMessage('Stock must be an integer').bail()
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer').bail()
    .isLength({min:1, max:10}).withMessage('Stock must be between 1 and 10 characters').bail()
    ,
    
    body('low_stock_threshold')//fix the db columnn to min value atleast 2
    .optional()
    .isInt({ min: 2, max: 20 }).withMessage('Low stock threshold must be a positive integer greater than 1'),

    (req,res,next)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }
        next();
        // res.status(200).json({message:"Product is valid"});
    }

]

//validate product update
const ValidateProductUpdate = [

    param('sku')

    
    
    .isString().withMessage('SKU must be a string').bail()
    .trim()
    .toUpperCase()
    .notEmpty().withMessage('SKU is required').bail()
    .isLength({min:3, max:100}).withMessage('SKU must be between 3 and 100 characters').bail()
    .matches(/^[A-Z0-9_-]+$/).withMessage('SKU can only contain letters, numbers, hyphens and underscores').bail()
    ,
     body('name')
    .notEmpty().withMessage('Name is required').bail()
    .trim()
    .isString().withMessage('Name must be a string').bail()
    .isLength({min:3, max:100}).withMessage('Name must be between 3 and 100 characters').bail()
    ,
    body('price')
    .notEmpty().withMessage('Price is required').bail()
    .isFloat({ gt: 0, max: 99999999.99 }).withMessage('Price must be a decimal number').bail()
    .isLength({min:1, max:10}).withMessage('Price must be between 1 and 10 characters').bail(),
   
    
    
    body('stock')
    .optional()
    // .notEmpty().withMessage('Stock is required')
    .isInt().withMessage('Stock must be an integer').bail()
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer').bail()
    .isLength({min:1, max:10}).withMessage('Stock must be between 1 and 10 characters').bail()
    ,
    
    body('low_stock_threshold')//fix the db columnn to min value atleast 2
    .optional()
    .isInt({ min: 2, max: 20 }).withMessage('Low stock threshold must be a positive integer greater than 1'),

    async (req,res,next)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }
        // const product = await findBySku(req.params.sku);
        // if (!product) {
        //     return res.status(404).json({ message: "Product with this sku not found" });
        // }
        next();

    }

   

]
export {ValidateSku, ValidateProduct, ValidateProductUpdate,ValidataionListquery};