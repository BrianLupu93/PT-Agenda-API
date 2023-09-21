const Income = require('../models/incomeModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('../utils/handleFactory');

exports.getAllIncomes = factory.getAll(Income);
exports.createIncome = factory.createOne(Income);
exports.deleteIncome = factory.deleteOne(Income);
