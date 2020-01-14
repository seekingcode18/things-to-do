const express = require('express');
const activities = require('./activities');
const router = express.Router();

router.use(express.json());

router.use('/activities', activities);

module.exports = router;