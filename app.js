require('dotenv').config();
const express = require('express');
const mongodb = require('mongodb');

const connectionString = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@testing01.as5pr.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;

const app = express();
const client = new mongodb.MongoClient(connectionString);

let db = undefined;

client.connect(function(error, client) {
    
    if (error !== null) {
        console.error(`Ooops connection failed: ${error}`);
    }
    console.log("connected!");
    
    db = client.db(process.env.MONGODB_DATABASE);    

    app.listen(3000);
});


app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.urlencoded({ extended: false }));

app.get('/', function(req, res) {
    
    let tasks = [];

    db.collection('tasks').find().toArray(function(error, result) {

        if (error !== null) {
            console.error(`Mongodb error: ${error}`)
        }

        tasks.push(...result);

        res.render('home', { tasks: tasks });
    });

});

app.post('/save-item', function(req, res) {
    const item = req.body.item;

    db.collection('tasks').insertOne({ text: item }, function(error) {
        if (error !== null) {
            console.error(`Mongodb error: ${error}`)
        }

        res.redirect('/');
    });
});