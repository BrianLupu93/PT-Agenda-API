const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Client name is required'],
  },
  clientId: {
    type: String,
    required: [true, 'Client ID is required'],
  },
  subscriptionId: {
    type: String,
    required: [true, 'Subscription ID is required'],
  },
  date: {
    type: String,
    required: [true, 'Date is required'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
  },
});

const Income = mongoose.model('Income', incomeSchema);

module.exports = Income;
