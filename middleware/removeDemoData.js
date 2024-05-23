const Booking = require("../models/bookingModel");
const Client = require("../models/clientModel");
const Income = require("../models/incomeModel");
const Subscription = require("../models/subscriptionModel");

exports.removeDemoData = async () => {
  await Client.deleteMany({});
  await Subscription.deleteMany({});
  await Booking.deleteMany({});
  await Income.deleteMany({});
  return;
};
