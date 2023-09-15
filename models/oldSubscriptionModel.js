const mongoose = require('mongoose');

const oldSubscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Client name is required'],
  },
  clientId: {
    type: String,
    required: [true, 'Client ID is required'],
  },
  oldSubscriptions: { type: Array, default: [] },
});

const OldSubscription = mongoose.model(
  'OldSubscription',
  oldSubscriptionSchema
);

module.exports = OldSubscription;
