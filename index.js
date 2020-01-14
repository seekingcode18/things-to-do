const express = require('express');
var bodyParser = require('body-parser');
const routes = require('./routes/index');
const app = express();

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use('/api/v1', routes)



app.listen(3000, () => console.log('server started on port 3000'))

module.exports = app;