const { ObjectID } = require('mongodb');
const Product = require('../models/product');

exports.getAdminProducts = (req, res, next) => {
    Product.findAll()
    .then((products) => {
        res.render('admin/products', {
            products : products,
            pageTitle : 'Admin Products',
            path : '/admin/products'
        });
    })
    .catch(err => {
        console.log(err)
    })
}

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        pageTitle : 'Add Product',
        path : '/admin/add-product'
    });
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageURL = req.body.imageURL;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(
        title, 
        price, 
        description, 
        imageURL,
        null,
        req.user._id
    );
    product.save()
    .then((result) => {
        console.log('Product Created');
        res.redirect('/admin/products');
    })
    .catch(err => {
        console.log(err);
    })
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if(!editMode){
        return res.redirect('/');
    }
    const productId = req.params.productId;

    // req.user.getProducts({where : {id : productId}})
    Product.findByPk(productId)
    .then((product) => {
        if(!product){
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            pageTitle : 'Edit Product',
            path : '/admin/edit-product',
            edit : editMode,
            product : product
        });
    })
    .catch(err => {
        console.log(err)
    })
}

exports.postEditProduct = (req, res, next) => {
    const productId = req.body.productId;
    const title = req.body.title;
    const imageURL = req.body.imageURL;
    const price = req.body.price;
    const description = req.body.description;

    const product = new Product(
        title, 
        price, 
        description, 
        imageURL,
        productId
    );
    
    product.save()
    .then((result) => {
        res.redirect(`/products/${productId}`);
        console.log('Product Updated');
    })
    .catch(err => {
        console.log(err);
    });
}


exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.deleteById(productId)
    .then((result) => {
        console.log('Product Deleted');
        res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
}