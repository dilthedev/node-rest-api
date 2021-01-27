const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const ProductsController = require('../controllers/products');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
  //reject a file
    if (file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);  
        cb(new Error('File Uploading Error, Please check file size and filetype, Try Again'))
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024*1024*5
    },
    fileFilter: fileFilter
});

const Product = require('../models/product');

//get all products
router.get('/', ProductsController.products_get_all_products);

//create product
router.post('/',  checkAuth , upload.single('productImage'), ProductsController.products_create_product);

//get single product
router.get('/:productId', ProductsController.products_get_single_product);

//update product
router.patch('/:productId',checkAuth , ProductsController.products_update_product);

//delete product
router.delete('/:productId', checkAuth , ProductsController.products_delete_product);


module.exports = router;