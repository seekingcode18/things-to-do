const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
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
    }
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
    type: Date,
    required: function () {
    if (this.frequency === 'once') return true
  }},
  cost: {
    type: String,
    enum: ['free', 'low', 'medium', 'high'],
    required: true
  },
})

const Activity = mongoose.model('Activity', activitySchema);
Activity.collection.drop();

module.exports = Activity;