const express = require('express');
const router = express.Router();
const Activity = require('./../models/model');

// get all activities
router.get('/', async (req, res) => {
    try {
      const activities = await Activity.find()
      res.json(activities)
    } catch(error) {
     res.status(500).json({message: error.message})
    }
})

// get one activity
router.get('/:id', async (req, res) => {
  try {
    const activity = await Activity.find({_id: req.params.id})
    res.json(activity)
  } catch(error) {
   res.status(500).json({message: error.message})
  }
})

// update one activity
router.put('/:id', async (req, res) => {
  try {
    const activity = await Activity.updateOne({_id: req.params.id}, req.body)
    res.json(activity)
  } catch(error) {
   res.status(500).json({message: error.message})
  }
})

// update one activity
router.delete('/:id', async (req, res) => {
  try {
    const activity = await Activity.findOneAndDelete({_id: req.params.id})
    res.json(activity)
  } catch(error) {
   res.status(500).json({message: error.message})
  }
})

// create one activity
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
    "date": req.body.date,
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