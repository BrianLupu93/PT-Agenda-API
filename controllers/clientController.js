const Client = require('../models/clientModel');
const Booking = require('../models/bookingModel');
const Income = require('../models/incomeModel');

const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');

exports.createClient = factory.createOne(Client);
exports.getAllClients = factory.getAll(Client);
exports.getClient = factory.getOne(Client);
exports.updateClient = factory.updateOne(Client);
exports.deleteClient = factory.deleteOne(Client);
exports.updateSubscription = factory.updateOne(Client);

exports.deleteSubscription = catchAsync(async (req, res, next) => {
  const foundedClient = await Client.findById(req.params.id);

  const clientBooking = await Booking.findOne({ clientId: req.params.id });

  if (clientBooking) {
    const newBookings = clientBooking.bookings.filter(
      (client) =>
        !foundedClient.subscription[0].trainingDays.some(
          (el) => client.day === el.day
        )
    );

    await Booking.findOneAndUpdate(
      { clientId: req.params.id },
      { bookings: newBookings }
    );
  }

  const income = await Income.findOne({
    year: foundedClient.subscription[0].startDate.slice(6, 10),
  });

  const newMonths = income.months.map((month) => {
    return {
      name: month.name,
      clients: month.clients.filter(
        (client) =>
          client.startDate !== foundedClient.subscription[0].startDate &&
          client.clientId === req.params.id
      ),
      total: month.clients.some(
        (client) =>
          client.startDate === foundedClient.subscription[0].startDate &&
          client.clientId === req.params.id
      )
        ? month.total - foundedClient.subscription[0].price
        : month.total,
    };
  });

  await Income.updateOne(
    {
      year: foundedClient.subscription[0].startDate.slice(6, 10),
    },
    {
      months: newMonths,
    }
  );

  await Client.findByIdAndUpdate(req.params.id, { subscription: [] });

  res.status(200).json({
    status: 'success',
    message: 'Subscription Deleted',
  });
});
