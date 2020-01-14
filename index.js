const express = require('express');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const app = express();

app.get('/', (req, res) => res.send('database homepage'))

mongoose.connect('mongodb://localhost:27017/db', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('mongodb started');
    app.listen(3000, () => {console.log('server started on port 3000')})
  })
  .catch((error) => console.log('mongodb connection failed. error: ', error));
