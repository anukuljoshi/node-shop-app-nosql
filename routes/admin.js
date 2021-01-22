const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

// url : /admin<admin_routes>

router.get('/products', adminController.getAdminProducts);

router.get('/add-product', adminController.getAddProduct);

router.post('/add-product', adminController.postAddProduct);

router.post('/edit-product', adminController.postEditProduct);

router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/delete-product', adminController.postDeleteProduct);

module.exports = router;

// exports.routes = router;
