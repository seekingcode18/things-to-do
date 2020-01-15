const express = require('express');
const router = express.Router();
const Activity = require('./../models/model');
  
router.get('/', async (req, res) => {
    try {
      const activities = await Activity.find()
      res.json(activities)
    } catch(error) {
     res.status(500).json({message: error.message})
    }
})

router.post('/', (req, res) => {
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

  const activity = new Activity(obj);
  
    activity.save(function(err, activity) {
      if (err) {
        console.log('Error: ', err)
        res.status(500).json({message: err.message})
      } else {
        console.log('Saved!')
        res.send(activity)
      };
    });
})
module.exports = router;