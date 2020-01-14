const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
  
  
router.get('/', (req, res) => {
    MongoClient.connect('mongodb://localhost:27017/', (err, db) => {
     if(err) throw err;
     const dbo = db.db('things_db')
     dbo.collection('activities').find({}).toArray((err, result) => {
       if(err) throw err;
       console.log(result);
       res.send(result);
       db.close();
     })
  });
})

router.post('/', (req, res) => {
    MongoClient.connect('mongodb://localhost:27017/', (err, db) => {
        if(err) throw err;
        const url = (process.env.NODE_ENV === 'test'? 'things_db_test':'things_db' )
        const dbo = db.db(url)
        let obj = {
            "category": req.body.category,
            "title": req.body.title,
            "location": {
              "city": req.body.city,
              "postcode": req.body.postcode
            },
            "description": req.body.description,
            "frequency": req.body.frequency,
            "date": new Date("2020-07-30T20:00:00"),
            "cost": req.body.cost
          }
        dbo.collection('activities').insert(obj, (err, result) => {
          if(err) throw err;
          console.log(result);
          res.send(result);
          db.close();
        })
     });
})
module.exports = router;