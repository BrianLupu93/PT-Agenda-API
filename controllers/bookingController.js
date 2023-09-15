const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const Client = require('../models/clientModel');

exports.getBookingAmount = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({});

  if (!bookings) {
    return res.status(404).json({
      status: 'success',
      message: 'No Bookings!',
    });
  }

  const bookingDays = [];

  bookings.map((client) =>
    client.bookings.map((book) => {
      bookingDays.push(book.day);
    })
  );

  const reduceBookings = bookingDays.reduce(function (acc, curr) {
    return (
      acc[curr]
        ? { day: curr, count: ++acc[curr] }
        : { day: acc, count: (acc[curr] = 1) },
      acc
    );
  }, {});

  const filteredBookings = Object.keys(reduceBookings).map((el) => {
    return { day: el, count: reduceBookings[el] };
  });

  res.status(200).json({
    status: 'success',
    data: filteredBookings,
  });
});

exports.getTodayBookings = catchAsync(async (req, res, next) => {
  const today = req.params.id.replace('/Y/g', '/');
  const allBookings = await Booking.find({});

  const foundedBookings = [];

  allBookings.forEach((item) => {
    if (item.bookings.length > 0) {
      const clientBooking = item.bookings.filter((book) => book.day === today);

      if (clientBooking.length > 0) {
        const client = {
          name: item.name,
          id: item.clientId,
          booking: clientBooking,
        };
        foundedBookings.push(client);
      }
    }
  });

  if (foundedBookings.length === 0) {
    return res.status(200).json({
      status: 'success',
      message: 'No Bookings',
      data: [],
    });
  }

  const formatTime = (time) => {
    let bookTime = parseInt(time.slice(0, 2));
    time.slice(3, 5) === '30' ? (bookTime += 0.5) : bookTime;
    return bookTime;
  };

  const sortedBookings = foundedBookings.sort(
    (a, b) => formatTime(a.booking[0].time) - formatTime(b.booking[0].time)
  );

  res.status(200).json({
    status: 'success',
    data: sortedBookings,
  });
});

exports.deleteBooking = catchAsync(async (req, res, next) => {
  const day = req.body.day;
  const scheduled = req.body.scheduled;
  const toSchedule = req.body.toSchedule;

  await Booking.updateOne(
    { clientId: req.params.id },
    {
      $pull: {
        bookings: {
          day: day,
        },
      },
    }
  );

  await Client.updateOne(
    { _id: req.params.id },
    {
      $pull: {
        'subscription.0.trainingDays': {
          day: day,
        },
      },
      'subscription.0.trainingsScheduled': scheduled,
      'subscription.0.trainingsToSchedule': toSchedule,
    }
  );

  res.status(200).json({
    status: 'success',
    message: 'Booking removed',
  });
});

exports.upadateBooking = catchAsync(async (req, res, next) => {
  const dayToDelete = req.body.dayToDelete;
  const dayToAdd = req.body.dayToAdd;

  await Booking.updateOne(
    { clientId: req.params.id },
    {
      $pull: {
        bookings: {
          day: dayToDelete,
        },
      },
    }
  );
  await Booking.updateOne(
    { clientId: req.params.id },
    {
      $push: {
        bookings: dayToAdd,
      },
    }
  );

  const foundedClient = await Client.findById(req.params.id);
  const updateReBookedNr = foundedClient.subscription[0].trainingsReBooked + 1;

  await Client.updateOne(
    { _id: req.params.id },
    {
      $pull: {
        'subscription.0.trainingDays': {
          day: dayToDelete,
        },
      },
    }
  );

  await Client.updateOne(
    { _id: req.params.id },
    {
      $push: {
        'subscription.0.trainingDays': dayToAdd,
      },
      'subscription.0.trainingsReBooked': updateReBookedNr,
    }
  );

  res.status(200).json({
    status: 'success',
    message: 'Booking Updated',
  });
});
