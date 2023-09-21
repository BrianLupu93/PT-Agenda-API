const Income = require('../models/incomeModel');
const catchAsync = require('../utils/catchAsync');

exports.deleteIncomes = catchAsync(async (req, res, next) => {
  await Income.deleteMany({ subscriptionId: req.params.id });
  res.status(200).json({
    status: 'success',
    message: 'All the subscription booking and income was deleted',
  });
});
