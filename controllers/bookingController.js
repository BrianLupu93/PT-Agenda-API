const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');

const factory = require('../utils/handleFactory');

exports.getAllBookings = factory.getAll(Booking);
exports.getBooking = factory.getOne(Booking);
exports.createBooking = factory.createOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);

exports.deleteAllBookings = catchAsync(async (req, res, next) => {
  await Booking.deleteMany({ subscriptionId: req.params.id });
  next();
});
