const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Client name is required'],
  },
  clientId: {
    type: String,
    required: [true, 'Client ID is required'],
  },
  bookings: { type: Array, default: [] },
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
