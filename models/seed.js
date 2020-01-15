const mongoose = require('mongoose')

const db_name = (process.env.NODE_ENV === 'test'? 'things_db_test':'things_db' );
let url = `mongodb://localhost:27017/${db_name}`;

mongoose.connect(url, {
  useNewUrlParser: true
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('db running')

  const Activity = require('./model')
  Activity.collection.drop();
  const activity = new Activity({
    "category": "Music",
    "title": "Dua Lipa",
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
