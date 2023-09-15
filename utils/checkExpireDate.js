const schedule = require('node-schedule');
const dayjs = require('dayjs');
const Client = require('../models/clientModel');
const AppError = require('./appError');

exports.checkExpireDate = async () => {
  //   Every morning at 6AM if subscription will end send sms * 6 * * *
  schedule.scheduleJob('0 6 * * *', async () => {
    const allClients = await Client.find({});

    const today = dayjs().format('DD/MM/YYYY');
    const oneDayBefore = dayjs().add(1, 'day').format('DD/MM/YYYY');
    const threeDaysBefore = dayjs().add(3, 'day').format('DD/MM/YYYY');

    if (!allClients) return next(new AppError('No Clients', 404));

    const clientsWithSubscription = allClients.filter((client) => {
      if (client.subscription !== undefined && client.subscription.length > 0)
        return client;
    });

    if (!clientsWithSubscription)
      return next(new AppError('No Clients with valid subscription', 404));

    clientsWithSubscription.map((client) => {
      const clientDay = parseInt(client.subscription[0].endDate.slice(0, 2));
      const clientMonth =
        parseInt(client.subscription[0].endDate.slice(3, 5)) - 1;
      const clientYear = parseInt(client.subscription[0].endDate.slice(6, 10));

      const clientEndDate = dayjs()
        .set('date', clientDay)
        .set('month', clientMonth)
        .set('year', clientYear)
        .format('DD/MM/YYYY');

      // 3 DAYS BEFORE EXPIRE DATE
      if (clientEndDate === threeDaysBefore) {
        return console.log('3 DAYS BEFORE END');
      }
      // 1 DAY BEFORE EXPIRE DATE
      if (clientEndDate === oneDayBefore) {
        return console.log('1 DAYS BEFORE END');
      }
      // TODAY IS THE EXPIRATION DAY
      if (clientEndDate === today) {
        return console.log('TODAY EXPIRE');
      }
    });
  });
};
