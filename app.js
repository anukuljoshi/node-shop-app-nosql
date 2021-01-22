const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const rootDir = require('./utils/rootDir');
const {mongoConnect} = require('./utils/database');

const errorController = require('./controllers/error');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const User = require('./models/user')

const app = express();

// ejs
app.set('view engine', 'ejs');
app.set('views', 'views');

// body parser
app.use(bodyParser.urlencoded({extended: false}));
// static files
app.use(express.static(path.join(rootDir, 'public')));

// put dummy user in req
app.use((req, res, next) => {
    User.findByPk('60096148e58adf90a88bacb6')
    .then((user) => {
        req.user = new User(user.username, user.email, user.cart, user._id);
        next();
    })
    .catch(err => {
        console.log(err);
    })
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use('/', errorController.get404);

mongoConnect(() => {
    app.listen(3000);
});