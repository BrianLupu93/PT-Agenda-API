const Booking = require('../models/bookingModel');
const Client = require('../models/clientModel');
const OldSubscription = require('../models/oldSubscriptionModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');

exports.auth = catchAsync(async (req, res, next) => {
  if (!req.headers || !req.headers.authorization) {
    return res.status(403).json({
      status: 'fail',
      message: 'Unauthenticated!',
    });
  }

  const token = req.headers.authorization.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) {
      return res.status(403).json({
        status: 'fail',
        message: 'token expired',
      });
    }
    next();
  });
});

exports.bookingAction = catchAsync(async (req, res, next) => {
  const subscription = req.body.subscription;
  const updateClientData = req.body.changeBookingData;

  const existClient = await Booking.findOne({ clientId: req.params.id });

  if (existClient) {
    if (updateClientData) {
      await Booking.updateOne(
        { clientId: req.params.id },
        {
          $set: { name: req.body.name },
        }
      );
    }
  }

  if (subscription.length === 0 || subscription[0]?.trainingDays?.length === 0)
    return next();

  if (!existClient) {
    await Booking.create({
      name: req.body.name,
      clientId: req.params.id,
      bookings: subscription[0].trainingDays,
    });
  }

  if (existClient) {
    const existingBookings = existClient.bookings;

    const newBookings = req.body.subscription[0].trainingDays.filter(
      (subBook) => {
        const exist = existingBookings.map((el) => el.day);
        if (subBook.day !== exist) return subBook.day;
      }
    );

    await Booking.updateOne(
      { clientId: req.params.id },
      {
        $set: { bookings: [...existingBookings, ...newBookings] },
      }
    );
  }

  return next();
});

exports.moveOldSubscription = catchAsync(async (req, res, next) => {
  const foundedClient = await Client.findById(req.params.id);

  const existWithOld = await OldSubscription.findOne({
    clientId: req.params.id,
  });

  if (existWithOld) {
    await OldSubscription.updateOne(
      { clientId: req.params.id },
      {
        $push: { oldSubscriptions: foundedClient.subscription[0] },
      }
    );
  }

  if (!existWithOld) {
    await OldSubscription.create({
      name: req.body.name,
      clientId: req.params.id,
      oldSubscriptions: foundedClient.subscription[0],
    });
  }

  return next();
});
