const Income = require("../models/incomeModel");
const Subscription = require("../models/subscriptionModel");
const catchAsync = require("../utils/catchAsync");

exports.createIncome = catchAsync(async (req, res, next) => {
  const foundedSubscription = await Subscription.findOne({
    clientId: req.body.clientId,
    isActive: true,
  });

  await Income.create({
    name: req.body.name,
    clientId: req.body.clientId,
    subscriptionId: foundedSubscription._id,
    date: foundedSubscription.startDate,
    price: foundedSubscription.price,
  });

  return;
});
