const Subscription = require('../models/subscriptionModel');
const catchAsync = require('../utils/catchAsync');

exports.checkActiveSubscription = catchAsync(async (req, res, next) => {
  const id = req.body.clientId;

  const foundedDoc = await Subscription.findOne({
    clientId: id,
    isActive: true,
  });

  if (foundedDoc) {
    return res.status(409).json({
      status: '409',
      message: 'Subscription already exist!',
    });
  }

  if (!foundedDoc) return next();
});
