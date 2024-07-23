const router = require('express').Router();
let Counter = require('../models/Counter');

router.route('https://leadai.netlify.app/ielts').get(async (req, res) => {
  try {
    let counter = await Counter.findOne({ name: 'resultsLoadCount' });
    if (!counter) {
      counter = new Counter({ name: 'resultsLoadCount', count: 0 });
      await counter.save();
    }
    res.json({ count: counter.count });
  } catch (error) {
    res.status(400).json('Error: ' + error);
  }
});

router.route('https://leadai.netlify.app/ielts').post(async (req, res) => {
  try {
    const counter = await Counter.findOneAndUpdate(
      { name: 'resultsLoadCount' },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );
    res.json({ count: counter.count });
  } catch (error) {
    res.status(400).json('Error: ' + error);
  }
});

module.exports = router;