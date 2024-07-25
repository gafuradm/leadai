const mongoose = require('mongoose');

const CounterSchema = new mongoose.Schema({
  name: String,
  count: Number
});

module.exports = mongoose.model('Counter', CounterSchema);