const express = require('express');

const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.urlencoded({ extended: false }));

app.get('/', function(req, res) {
    
    res.render('home');
});

app.post('/save-item', function(req, res) {
    const item = req.body.item;
});

app.listen(3000);