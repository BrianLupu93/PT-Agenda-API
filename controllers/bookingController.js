const Booking = require('../models/bookingModel');
const Subscription = require('../models/subscriptionModel');
const catchAsync = require('../utils/catchAsync');

const factory = require('../utils/handleFactory');

exports.getAllBookings = factory.getAll(Booking);
exports.getBooking = factory.getOne(Booking);
exports.createBooking = factory.createOne(Booking);

exports.deleteBooking = catchAsync(async (req, res, next) => {
  const foundedBooking = await Booking.findById(req.params.id);
  const subscriptionId = foundedBooking.subscriptionId;
  const foundedSubscription = await Subscription.findById(subscriptionId);

  const newTrainingDays = foundedSubscription.trainingDays.filter(
    (day) => day.day !== foundedBooking.day.day
  );

  await Subscription.findByIdAndUpdate(subscriptionId, {
    trainingDays: newTrainingDays,
    trainingsScheduled: foundedSubscription.trainingsScheduled - 1,
    trainingsToSchedule: foundedSubscription.trainingsToSchedule + 1,
  });

  await Booking.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: 'success',
    message: 'Booking Deleted',
  });
});

exports.updateBooking = catchAsync(async (req, res, next) => {
  const foundedBooking = await Booking.findById(req.params.id);
  const subscriptionId = foundedBooking.subscriptionId;
  const foundedSubscription = await Subscription.findById(subscriptionId);

  const newTrainingDays = foundedSubscription.trainingDays.filter(
    (day) => day.day !== foundedBooking.day.day
  );
  newTrainingDays.push(req.body.day);

  await Subscription.findByIdAndUpdate(subscriptionId, {
    trainingDays: newTrainingDays,
    trainingsReBooked: foundedSubscription.trainingsReBooked + 1,
  });

  await Booking.findByIdAndDelete(req.params.id);
  await Booking.create(req.body);

  res.status(200).json({
    status: 'success',
    message: 'Trainig ReBooked',
  });
});

exports.deleteAllBookings = catchAsync(async (req, res, next) => {
  await Booking.deleteMany({ subscriptionId: req.params.id });
  next();
});
