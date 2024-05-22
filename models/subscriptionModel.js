const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Client name is required'],
  },
  clientId: {
    type: String,
    required: [true, 'Client ID is required'],
  },
  trainingsTotal: Number,
  trainingsDone: Number,
  trainingsRemain: Number,
  trainingsReBooked: Number,
  trainingsScheduled: Number,
  trainingsToSchedule: Number,
  startDate: String,
  endDate: String,
  isActive: Boolean,
  alertMessage: { type: String, default: 'ACTIV' },
  price: Number,
  nutrition: Number,
  trainingDays: { type: Array, default: [] },
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
