const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/things_db', {
  useNewUrlParser: true
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('db running')

  const Activity = require('./model')
  const activity = new Activity({
    "category": "Music",
    "title": "Dua SKDNOGANSFMKGDNSRGKLN AKSDONG KALSD",
    "location": {
      "city": "London",
      "postcode": "SE1 7AY"
    },
    "description": "A concert in London for the first time...",
    "frequency": "once",
    "date": new Date("2020-07-30T20:00:00"),
    "cost": "high"
  });
  const runSeed = () => {
    activity.save(function(err) {
      if (err) {
        console.log('Error: ', err)
      } else {
        console.log('Saved!')
      };
    });
  }

  runSeed();
})