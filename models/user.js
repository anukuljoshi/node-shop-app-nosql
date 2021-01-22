const { ObjectID } = require('mongodb');
const { getDB } = require("../utils/database");

class User{
    constructor(username, email, cart, id){
        this.username = username;
        this.email = email;
        this.cart = cart;   // {item : [...]}
        this._id =  id;
    }

    save(){
        const db = getDB();
        return db.collection('users').insertOne(this);
    }

    addToCart(product){
        const db = getDB();
        const cartProductIndex = this.cart.items.findIndex(prod => {
            return (prod.productId.toString() === product._id.toString());
        });

        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items];
        if(cartProductIndex>=0){
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        }else{
            updatedCartItems.push({
                productId : ObjectID(product._id),
                quantity : newQuantity
            })
        }
        const updatedCart = {
            items: updatedCartItems
        };
        return db.collection('users').updateOne(
            {
                _id : ObjectID(this._id)
            },
            {
                $set : {cart : updatedCart}
            }
        );
    }

    getCart(){
        const db = getDB();
        const productIds = this.cart.items.map(item => {
            return item.productId;
        });
        return db.collection('products').find({
            _id :  {$in : productIds}
        })
        .toArray()
        .then((products) => {
            const productIds = products.map(item => {
                return item._id.toString();
            });
            const updatedCartItems = this.cart.items.filter((item) =>{ 
                const exist = productIds.find(id => id===item.productId.toString());
                return (exist) ? true : false;
            });
            const updatedCart = {
                items : updatedCartItems
            }
            return db.collection('users').updateOne(
                {
                    _id : ObjectID(this._id)
                },
                {
                    $set : {cart : updatedCart}
                }
            )
            .then((result) => {
                return products.map(product => {
                    return {
                        ...product, 
                        quantity : this.cart.items.find(item => (item.productId.toString() === product._id.toString()
                        )).quantity
                    }
                })
            })
            .catch(err => console.log(err));
        });
    }

    deleteItemFromCart(productId){
        const updatedCartItems = this.cart.items.filter(item => item.productId.toString() !==productId.toString());
        const db = getDB();
        return db.collection('users').updateOne(
            {
                _id : ObjectID(this._id)
            },
            {
                $set : {cart : {items : updatedCartItems}}
            }
        );
    }

    // orders
    addOrder() {
        const db = getDB();
        return this.getCart().then(products => {
            const order = {
                items : products,
                user : {
                    _id : ObjectID(this._id),
                    username : this.username,
                    email : this.email
                }
            };
            db.collection('orders').insertOne(order)
            .then((result) => {
                this.cart = {items : []}
                return db.collection('users').updateOne(
                    {
                        _id : ObjectID(this._id)
                    },
                    {
                        $set : {cart : {items : []}}
                    }
                );
            })
            .catch(err => console.log(err))
        });
    }

    getOrders() {
        const db = getDB();
        return db.collection('orders').find({'user._id' : ObjectID(this._id)}).toArray();
    }

    static findByPk(id){
        const db = getDB();
        return db.collection('users')
        .find({_id : ObjectID(id)})
        .next();
    }
}

module.exports = User;