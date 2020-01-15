const express = require('express');
var bodyParser = require('body-parser');
const routes = require('./routes/index');
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const pug = require('pug');
const path = require('path')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({
  extended: false
}));

const db_name = (process.env.NODE_ENV === 'test'? 'things_db_test':'things_db' );
let url = `mongodb://localhost:27017/${db_name}`;

mongoose.connect(url, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to db'))

app.use(express.json())
app.use('/api/v1', routes)

app.get('/', (req, res) => {
  res.render('index', {title: 'Awesome home page'})
})


app.listen(3000, () => console.log('server started on port 3000'))

module.exports = app;