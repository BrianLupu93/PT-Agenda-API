const Subscription = require('../models/subscriptionModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('../utils/handleFactory');

exports.getAllSubscriptions = factory.getAll(Subscription);
exports.getSubscription = factory.getOne(Subscription);
exports.updateSubscription = factory.updateOne(Subscription);
exports.deleteSubscription = factory.deleteOne(Subscription);

exports.getAllActiveSubscriptions = catchAsync(async (req, res, next) => {
  const activeSubscriptions = await Subscription.find({ isActive: true });

  if (activeSubscriptions.length === 0) {
    return res.status(200).json({
      status: 'success',
      message: 'No Active Subscriptions',
    });
  }
  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    data: activeSubscriptions,
  });
});

exports.createSubscription = catchAsync(async (req, res, next) => {
  const doc = await Subscription.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
  next();
});

exports.updateExpiredSubscription = catchAsync(async (req, res, next) => {
  await Subscription.findByIdAndUpdate(req.params.id, { isActive: false });

  await Subscription.create(req.body);
  res.status(201).json({
    status: 'success',
    message: 'Expired subscription updated',
  });
  next();
});
