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
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
