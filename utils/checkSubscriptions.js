// const schedule = require('node-schedule');
// const dayjs = require('dayjs');
// const Client = require('../models/clientModel');
// const OldSubscription = require('../models/oldSubscriptionModel');

// exports.checkSubscriptions = async () => {
//   const today = dayjs().format('DD/MM/YYYY');

//   const allClients = await Client.find({});

//   if (!allClients) {
//     return res.status(404).json({
//       status: 'success',
//       message: 'No Clients',
//     });
//   }

//   const clientsWithSubscription = allClients.filter((client) => {
//     if (client.subscription !== undefined && client.subscription.length > 0)
//       return client;
//   });

//   if (!clientsWithSubscription) {
//     return res.status(404).json({
//       status: 'success',
//       message: 'No Clients with valid subscription',
//     });
//   }

//   //   Every morning at 4AM put the Expire Today on the front * 4 * * *
//   schedule.scheduleJob('0 4 * * *', async () => {
//     clientsWithSubscription.map(async (client) => {
//       if (client.subscription[0].endDate === today) {
//         await Client.findByIdAndUpdate(client._id, {
//           'subscription.0.isActive': false,
//         });
//       }
//     });
//   });
// };

// exports.moveOldSubscription = async () => {
//   const allClients = await Client.find({});
//   const clientsWithSubscription = allClients.filter((client) => {
//     if (client.subscription !== undefined && client.subscription.length > 0)
//       return client;
//   });

//   //   Every evening at 23 PM archieve the subscription and let the client without subscription * 23 * * *
//   schedule.scheduleJob('0 23 * * *', async () => {
//     clientsWithSubscription.map(async (client) => {
//       if (client.subscription[0].isActive === false) {
//         const existWithOld = await OldSubscription.findOne({
//           clientId: client._id,
//         });

//         if (existWithOld) {
//           await OldSubscription.updateOne(
//             { clientId: client._id },
//             {
//               $push: { oldSubscriptions: client.subscription[0] },
//             }
//           );
//         }
//         if (!existWithOld) {
//           await OldSubscription.create({
//             name: client.name,
//             clientId: client._id,
//             oldSubscriptions: client.subscription[0],
//           });
//         }

//         await Client.findByIdAndUpdate(client._id, {
//           subscription: [],
//         });
//       }
//     });
//   });
// };
