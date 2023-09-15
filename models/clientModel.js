const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Client name is required'],
  },
  email: {
    type: String,
    required: [true, 'Client email is required'],
  },
  phone: {
    type: String,
    required: [true, 'Client phone is required'],
  },

  subscription: [
    {
      trainingsTotal: Number,
      trainingsDone: Number,
      trainingsRemain: Number,
      trainingsReBooked: Number,
      trainingsScheduled: Number,
      trainingsToSchedule: Number,
      startDate: String,
      endDate: String,
      isActive: Boolean,
      price: Number,
      trainingDays: [],
    },
  ],
  default: {},
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
