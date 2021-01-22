const { ObjectID } = require('mongodb');
const {getDB} = require('../utils/database');

class Product {
    constructor(title, price, description, imageURL, id, userId){
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageURL = imageURL;
        this._id = id ? ObjectID(id) : null;
        this.userId = userId
    }

    save(){
        const db = getDB();
        let dbOperation;
        if(this._id){
            // update product
            dbOperation = db.collection('products').updateOne(
                {
                    _id : this._id
                },
                {
                    $set : this
                }
            );
        }
        else{
            // create new product
            dbOperation = db.collection('products').insertOne(this);
        }
        return dbOperation.then(result => {
            console.log(result);
        })
        .catch(err => console.log(err));
    }

    static findAll(){
        const db = getDB();
        return db.collection('products')
        .find()
        .toArray()
        .then((products) => {
            return products;
        })
        .catch(err => {
            console.log(err);
        });
    }

    static findByPk(id){
        const db = getDB();
        return db.collection('products')
        .find({_id : ObjectID(id)})
        .toArray()
        .then((products) => {
            const product = products[0];
            return product;
        })
        .catch(err => {
            console.log(err);
        })
    }

    static deleteById(id){
        const db = getDB();
        return db.collection('products').deleteOne({_id : ObjectID(id)});
    }
}

module.exports = Product;