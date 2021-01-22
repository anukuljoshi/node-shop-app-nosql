const Product = require('../models/product');
// const Cart = require('../models/cart');
// const CartItem = require('../models/cart-item');
// const Order= require('../models/order');
// const OrderItem = require('../models/order-item');

exports.getIndex = (req, res, next) => {
    Product.findAll()
    .then((products) => {
        res.render('shop/index', {
            products : products,
            pageTitle : 'Shop',
            path : '/'
        });
    })
    .catch(err => {
        console.log(err);
    });
}

exports.getProductList = (req, res, next) => {
    Product.findAll()
    .then((products) => {
        res.render('shop/product-list', {
            products : products,
            pageTitle : 'Product List',
            path : '/products'
        });
    })
    .catch(err => {
        console.log(err);
    });
}

exports.getProductDetail = (req, res, next) => {
    const productId = req.params.productId;
    Product.findByPk(productId)
    .then((product) => {
        res.render('shop/product-detail', {
            pageTitle : 'Detail', 
            // pageTitle : product.title, 
            path : `/products`,
            product : product
        });
    })
    .catch(err => {
        console.log(err);
    });
}

exports.getCart = (req, res, next) => {
    req.user.getCart()
    .then((products) => {
        res.render('shop/cart', {
            pageTitle : 'My Cart',
            path : '/cart', 
            products : products
        });
    })
    .catch(err => {
        console.log(err);
    })
}

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findByPk(productId)
    .then((product) => {
        req.user.addToCart(product)
        .then((result) => {
            console.log('Product Added');
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err))
}

exports.postCartDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    req.user.deleteItemFromCart(productId)
    .then((result) => {
        console.log('Product Deleted From Cart');
        res.redirect('/cart');
    })
    .catch(err => console.log(err))
}

exports.postOrder = (req, res, next) => {
    req.user.addOrder()
    .then((result) => {
        console.log('Order Created');
        res.redirect('/orders');
    })
    .catch(err => console.log(err))
}

exports.getOrders = (req, res, next) => {
    req.user.getOrders()
    .then((orders) => {
        res.render('shop/orders', {
            pageTitle : 'My Orders',
            path : '/orders',
            orders : orders
        });
    })
    .catch(err => console.log(err))
}

exports.getCheckout = (req, res, next) => {
    res.render('/shop/checkout', {
        pageTitle : 'Checkout',
        path : '/checkout'
    });
}
