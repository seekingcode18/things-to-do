const express = require('express');
const mongoose = require('mongoose');
// const seedFile = require('./models/seed');

const app = express();

app.get('/', (req, res) => res.send('database homepage'))
mongoose.connect('mongodb://localhost:27017/things_db', {
  useNewUrlParser: true
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('db running')
  // seedFile();

app.listen(3000, () => console.log('server started on port 3000'))
})
