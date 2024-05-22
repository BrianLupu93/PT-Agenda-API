const Client = require("../models/clientModel");
const Income = require("../models/incomeModel");
const Subscription = require("../models/subscriptionModel");

exports.removeDemoData = async () => {
  await Client.deleteMany({});
  return;
};
