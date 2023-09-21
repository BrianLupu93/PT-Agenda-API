const Booking = require('../models/bookingModel');
const Subscription = require('../models/subscriptionModel');
const catchAsync = require('../utils/catchAsync');

exports.createBookings = catchAsync(async (req, res, next) => {
  if (req.body.trainingDays.length === 0) return next();

  const foundedSubscription = await Subscription.findOne({
    clientId: req.body.clientId,
    isActive: true,
  });

  req.body.trainingDays.forEach(async (bookDay) => {
    await Booking.create({
      name: req.body.name,
      clientId: req.body.clientId,
      subscriptionId: foundedSubscription._id,
      day: bookDay,
    });
  });
  next();
});
