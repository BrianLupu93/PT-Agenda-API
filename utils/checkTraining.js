// const schedule = require('node-schedule');
// const dayjs = require('dayjs');
// const Client = require('../models/clientModel');
// const Booking = require('../models/bookingModel');

// exports.checkTraining = () => {
//   const startTime = 6;
//   const endTime = 23;

//   //   Every 20 minutes  */20 * * * *
//   schedule.scheduleJob(
//     { start: startTime, end: endTime, rule: '/20 * * * *' },
//     async () => {
//       const today = dayjs().format('DD/MM/YYYY');
//       const hour = dayjs().hour();
//       const minute = dayjs().minute();
//       const timeNow = hour * 3600 + minute * 60;

//       const allClients = await Client.find({});

//       if (!allClients) {
//         return res.status(404).json({
//           status: 'success',
//           message: 'No Clients',
//         });
//       }

//       const clientsWithSubscription = allClients.filter((client) => {
//         if (client.subscription !== undefined && client.subscription.length > 0)
//           return client;
//       });

//       const todayClients = clientsWithSubscription.filter((client) => {
//         const hasTrainingToday = client.subscription[0].trainingDays.some(
//           (item) => item.day === today
//         );
//         if (hasTrainingToday) return client;
//       });

//       todayClients.map(async (client) => {
//         const matchingDay = client.subscription[0].trainingDays.find(
//           (item) => item.day === today
//         );

//         const endHour = parseInt(matchingDay.time.slice(6, 8));
//         const endMinute = parseInt(matchingDay.time.slice(9, 11));
//         const trainingTime = endHour * 3600 + endMinute * 60;

//         if (matchingDay.done === false) {
//           if (timeNow > trainingTime) {
//             const trainingDayIndex =
//               client.subscription[0].trainingDays.findIndex(
//                 (el) => el.day === matchingDay.day
//               );

//             await Client.findByIdAndUpdate(client._id, {
//               'subscription.0.trainingsDone':
//                 client.subscription[0].trainingsDone + 1,
//               'subscription.0.trainingsRemain':
//                 client.subscription[0].trainingsTotal -
//                 client.subscription[0].trainingsDone -
//                 1,

//               $set: {
//                 [`subscription.0.trainingDays.${trainingDayIndex}.done`]: true,
//               },
//             });

//             const bookingData = await Booking.findOne({ clientId: client._id });
//             const bookingDayIndex = bookingData.bookings.findIndex(
//               (el) => el.day === matchingDay.day
//             );

//             await Booking.updateOne(
//               { clientId: client._id },
//               {
//                 $set: { [`bookings.${bookingDayIndex}.done`]: true },
//               }
//             );
//           }
//         }
//       });
//     }
//   );
// };
