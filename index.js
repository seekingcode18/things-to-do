const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.get('/', (req, res) => res.send('database homepage'))
mongoose.connect('mongodb://localhost:27017/things_db', {
  useNewUrlParser: true
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('db running')
  const activityShema = new mongoose.Schema({
    category: {
      type: String,
      enum: ['Music', 'Galleries', 'Children', 'Food'],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    location: {
      street: {
        type: String,
        required: false
      },
      borough: {
        type: String,
        required: false
      },
      city: {
        type: String,
        required: true
      },
      postcode: {
        type: String,
        required: true
      },
      required: true
    },
    description: {
      type: String
    },
    frequency: {
      type: String,
      enum: ['seasonal', 'ongoing', 'once']
    },
    start_date: {
      type: Date,
      required: function () {
        if (this.frequency === 'seasonal') return true
      }
    },
    end_date: {
      type: Date,
      required: function () {
        if (this.frequency === 'seasonal') return true
      }
    },
    date: {
      type: Date
    },
    required: function () {
      if (this.frequency === 'once') return true
    },
    cost: {
      type: String,
      enum: ['free', 'low', 'medium', 'high'],
      required: true
    },
  })

  const Activity = mongoose.model('Activity', activityShema);

  
app.listen(3000, () => console.log('server started on port 3000'))
})