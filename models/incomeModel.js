const mongoose = require('mongoose');

const monthSchema = new mongoose.Schema({
  name: String,
  clients: Array,
  total: Number,
});

const incomeSchema = new mongoose.Schema({
  year: String,
  months: [monthSchema],
});

const Income = mongoose.model('Income', incomeSchema);

module.exports = Income;
