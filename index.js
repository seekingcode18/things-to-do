const express = require('express');
var bodyParser = require('body-parser');
const routes = require('./routes/index');
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const pug = require('pug');
const path = require('path')
const axios = require('axios')
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

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
  axios.get('/api/v1/activities', {proxy: { host: '127.0.0.1', port: 3000}}).then( (resp) =>{
    console.log(resp.data)
  res.render('index', {title: 'Awesome home page', data: resp.data})})
  .catch((error) => res.render('error',{error: error}) )
})

app.get('/add', (req, res) => {
  res.render('form', {title: 'Add an activity'})
})

// this one doesn't load the style sheet
app.get('/update/:id', (req, res) => {
  res.render('update', {title: 'Update an activity', id: req.params.id})
})

app.post('/adding', (req, res) => {
  axios.post('/api/v1/activities', req.body, {proxy: { host: '127.0.0.1', port: 3000}}).then( (resp) =>{
    console.log(resp.data)
    res.send('it sent')})
    .catch((error) => res.render('error',{error: error}) )
  })

  app.post('/updating', (req, res) => {
    axios.put(`/api/v1/activities/${req.body._id}`, req.body, {proxy: { host: '127.0.0.1', port: 3000}}).then( (resp) =>{
      console.log('updating resp: ', resp.data)
      res.redirect(`/details/${req.body._id}`)})
      .catch((error) => res.render('error',{error: error}) )
    })

    // this one doesn't load the style sheet
    app.get('/details/:id', (req, res) => {
      axios.get(`/api/v1/activities/${req.params.id}`, {proxy: { host: '127.0.0.1', port: 3000}}).then((resp) => {
    console.log('success :', resp.data)
    res.render('details', {data: resp.data[0], title: 'Event Details'})
  }).catch((error) => res.status(500).render('error', {error: error}))

})


app.listen(3000, () => console.log('server started on port 3000'))

module.exports = app;