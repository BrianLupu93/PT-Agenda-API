const Client = require('../models/clientModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('../utils/handleFactory');

exports.getAllClients = factory.getAll(Client);
exports.getClient = factory.getOne(Client);
exports.createClient = factory.createOne(Client);
exports.updateClient = factory.updateOne(Client);
exports.deleteClient = factory.deleteOne(Client);
