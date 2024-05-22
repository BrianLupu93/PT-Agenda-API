const Client = require("../models/clientModel");
const Income = require("../models/incomeModel");
const Subscription = require("../models/subscriptionModel");
const catchAsync = require("../utils/catchAsync");

const createOne = async (Model, data) => {
  return await Model.create(data);
};

exports.createDemoData = async () => {
  Promise.all(
    demoClients.map(async (clientData) => {
      await Client.create(clientData);
    })
  );
  return;
};

const demoClients = [
  { name: "Jessica Brown", phone: "1234567890", email: "email@email.com" },
  { name: "Anna Roger", phone: "1234567890", email: "email@email.com" },
  { name: "Brian Cob", phone: "1234567890", email: "email@email.com" },
  { name: "Andrew Niels", phone: "1234567890", email: "email@email.com" },
  { name: "Daniel Heim", phone: "1234567890", email: "email@email.com" },
  { name: "Patrik Bonoa", phone: "1234567890", email: "email@email.com" },
  { name: "Erika Foost", phone: "1234567890", email: "email@email.com" },
  { name: "Natalia Bush", phone: "1234567890", email: "email@email.com" },
  { name: "Robert Joe", phone: "1234567890", email: "email@email.com" },
  { name: "Norbert Ruson", phone: "1234567890", email: "email@email.com" },
  { name: "Taylor Seen", phone: "1234567890", email: "email@email.com" },
  { name: "Beatrice Nader", phone: "1234567890", email: "email@email.com" },
  { name: "Sarah Pace", phone: "1234567890", email: "email@email.com" },
];
