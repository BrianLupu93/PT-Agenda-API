const dayjs = require("dayjs");
const Client = require("../models/clientModel");
const Income = require("../models/incomeModel");
const Subscription = require("../models/subscriptionModel");
const Booking = require("../models/bookingModel");
const { checkDoneTrainings } = require("../cron-jobs/scheduledJobs");

exports.createDemoData = async () => {
  const today = dayjs().format("DD/MM/YYYY");

  // Create clients examples
  await Promise.all(
    demoClients.map(async (clientData) => {
      await Client.create(clientData);
    })
  );

  const allClients = await Client.find({});
  const clientsToSubscribe = allClients.slice(0, 4);

  // Create subscriptions examples
  await Promise.all(
    clientsToSubscribe.map(async (client, i) => {
      await Subscription.create({
        name: client.name,
        clientId: client._id,
        trainingsTotal: i == 0 ? 36 : 12,
        trainingsDone: 0,
        trainingsRemain: i == 0 ? 36 : 12,
        trainingsReBooked: 0,
        trainingsScheduled: 4,
        trainingsToSchedule: i == 0 ? 32 : 8,
        startDate: today,
        endDate: dayjs()
          .add(i == 0 ? 12 : 4, "weeks")
          .format("DD/MM/YYYY"),
        isActive: true,
        price: i == 0 ? 550 : 200,
        trainingDays: [
          { day: today, time: trainingsHours[i] },
          {
            day: dayjs().add(2, "days").format("DD/MM/YYYY"),
            time: trainingsHours[i],
          },
          {
            day: dayjs().add(4, "days").format("DD/MM/YYYY"),
            time: trainingsHours[i],
          },
          {
            day: dayjs().add(6, "days").format("DD/MM/YYYY"),
            time: trainingsHours[i],
          },
        ],
      });
    })
  );

  // Create bookings example
  const allSubscriptions = await Subscription.find({});

  await Promise.all(
    allSubscriptions.map(async (sub) => {
      sub.trainingDays.forEach(async (bookDay) => {
        await Booking.create({
          name: sub.name,
          clientId: sub.clientId,
          subscriptionId: sub._id,
          day: bookDay,
        });
      });
    })
  );

  await checkDoneTrainings();

  //   Create incomes example
  await Promise.all(
    allSubscriptions.map(async (sub) => {
      await Income.create({
        name: sub.name,
        clientId: sub.clientId,
        subscriptionId: sub._id,
        date: sub.startDate,
        price: sub.price,
      });
    })
  );
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
  { name: "Gregor Vince", phone: "1234567890", email: "email@email.com" },
];

const trainingsHours = [
  "07:00-08:00",
  "08:00-09:00",
  "17:00-18:00",
  "20:00-21:00",
];
