const mongoose = require('mongoose');

const daySchema = new mongoose.Schema({
  day: String,
  time: String,
  done: Boolean,
});

const bookingSchema = new mongoose.Schema({
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
  day: daySchema,
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
