const fs = require('fs');
const path = require('path');

const mongodb = require('mongodb');

const rootDir = require('../utils/rootDir');


const MongoClient = mongodb.MongoClient;
let _db;

const mongoConnect = (callback) => {
    const data = fs.readFileSync(path.join(rootDir, 'mongodbCredentials.txt'));
    const creds = data.toString().split('\n');

    const username = creds[0];
    const password = creds[1];
    const dbname = creds[2];

    const mongoClient = new MongoClient(
        `mongodb+srv://${username}:${password}@cluster0.zdvwj.mongodb.net/${dbname}?retryWrites=true&w=majority`,
        {
            useUnifiedTopology : true
        }
    )

    mongoClient.connect()
    .then((client) => {
        console.log('Connected to MongoDB');
        _db = client.db();
        callback();
    })
    .catch(err => {
        console.log(err);
        throw err;
    });
}

const getDB = () => {
    if(_db){
        return _db;
    }
    throw 'No Database Found'
}

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;