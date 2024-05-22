const dayjs = require('dayjs');
const Booking = require('../models/bookingModel');
const Subscription = require('../models/subscriptionModel');
const { sendSms } = require('../utils/sendSms');
const { smsOne, smsToday, smsFive } = require('../utils/smsTemplate');
const Client = require('../models/clientModel');

//  ----------- CHECK TRAININGS DONE ------------
// ----------------------------------------------
exports.checkDoneTrainings = async () => {
  const today = dayjs().format('DD/MM/YYYY');
  const hour = dayjs().hour();
  const minute = dayjs().minute();
  const timeNow = hour * 3600 + minute * 60;

  const allBookings = await Booking.find({});

  if (!allBookings) return;

  const todayBookings = allBookings.filter(
    (booking) => booking.day.day === today
  );

  await Promise.all(
    todayBookings.map(async (booking) => {
      const endHour = parseInt(booking.day.time.slice(6, 8));
      const endMinute = parseInt(booking.day.time.slice(9, 11));
      const trainingTime = endHour * 3600 + endMinute * 60;

      if (!booking.day.done) {
        if (timeNow > trainingTime) {
          const foundedSubscription = await Subscription.findById(
            booking.subscriptionId
          );

          await Subscription.findByIdAndUpdate(booking.subscriptionId, {
            trainingsDone: foundedSubscription.trainingsDone + 1,
            trainingsRemain:
              foundedSubscription.trainingsTotal -
              foundedSubscription.trainingsDone -
              1,
          });

          await Booking.updateOne(
            {
              subscriptionId: booking.subscriptionId,
              'day.day': booking.day.day,
            },
            { 'day.done': true }
          );
        }
      }
    })
  );
};

//  ----------- SEND SMS TO CLIENT ------------
// ----------------------------------------------

exports.sendSmsToClient = async () => {
  const today = dayjs().format('DD/MM/YYYY');
  const oneDayBefore = dayjs().add(1, 'day').format('DD/MM/YYYY');
  const fiveDaysBefore = dayjs().add(5, 'day').format('DD/MM/YYYY');

  const allActiveSubscriptions = await Subscription.find({ isActive: true });

  if (!allActiveSubscriptions) return;

  Promise.all(
    allActiveSubscriptions.map(async (sub) => {
      const subEndDay = parseInt(sub.endDate.slice(0, 2));
      const subEndMonth = parseInt(sub.endDate.slice(3, 5)) - 1;
      const subEndYear = parseInt(sub.endDate.slice(6, 10));

      const subEndDate = dayjs()
        .set('date', subEndDay)
        .set('month', subEndMonth)
        .set('year', subEndYear)
        .format('DD/MM/YYYY');

      const foundedClient = await Client.findById(sub.clientId);

      // 5 DAYS BEFORE EXPIRE DATE
      if (subEndDate === fiveDaysBefore) {
        await sendSms(
          foundedClient.phone,
          smsFive(foundedClient.name, sub.trainingsTotal, sub.endDate)
        );
      }
      // 1 DAY BEFORE EXPIRE DATE
      if (subEndDate === oneDayBefore) {
        await sendSms(
          foundedClient.phone,
          smsOne(foundedClient.name, sub.trainingsTotal, sub.endDate)
        );
      }
      // TODAY IS THE EXPIRATION DAY
      if (subEndDate === today) {
        await sendSms(
          foundedClient.phone,
          smsToday(foundedClient.name, sub.trainingsTotal)
        );
      }
    })
  );
};

//  ----------- CHECK EXPIRE DATE ------------
// ----------------------------------------------

exports.checkExpireDate = async () => {
  const today = dayjs().format('DD/MM/YYYY');
  const oneDayBefore = dayjs().add(1, 'day').format('DD/MM/YYYY');
  const twoDaysBefore = dayjs().add(2, 'day').format('DD/MM/YYYY');
  const threeDaysBefore = dayjs().add(3, 'day').format('DD/MM/YYYY');

  const allActiveSubscriptions = await Subscription.find({ isActive: true });

  if (!allActiveSubscriptions) return;

  Promise.all(
    allActiveSubscriptions.map(async (sub) => {
      const subEndDay = parseInt(sub.endDate.slice(0, 2));
      const subEndMonth = parseInt(sub.endDate.slice(3, 5)) - 1;
      const subEndYear = parseInt(sub.endDate.slice(6, 10));

      const subEndDate = dayjs()
        .set('date', subEndDay)
        .set('month', subEndMonth)
        .set('year', subEndYear)
        .format('DD/MM/YYYY');

      // 3 DAYS BEFORE EXPIRE DATE
      if (subEndDate === threeDaysBefore) {
        await Subscription.findOneAndUpdate(sub._id, {
          alertMessage: 'Expira: 3 zile',
        });
        return;
      }
      // 2 DAYS BEFORE EXPIRE DATE
      if (subEndDate === twoDaysBefore) {
        await Subscription.findOneAndUpdate(sub._id, {
          alertMessage: 'Expira: 2 zile',
        });
        return;
      }
      // 1 DAY BEFORE EXPIRE DATE
      if (subEndDate === oneDayBefore) {
        await Subscription.findOneAndUpdate(sub._id, {
          alertMessage: 'Expira: 1 zi',
        });
        return;
      }
      // TODAY IS THE EXPIRATION DAY
      if (subEndDate === today) {
        await Subscription.findOneAndUpdate(sub._id, {
          alertMessage: 'Expira: AZI',
        });
        return;
      }
      if (
        subEndDate !== today &&
        subEndDate !== oneDayBefore &&
        subEndDate !== twoDaysBefore &&
        subEndDate !== threeDaysBefore &&
        sub.alertMessage !== 'ACTIV'
      ) {
        await Subscription.findOneAndUpdate(sub._id, {
          alertMessage: 'ACTIV',
        });
        return;
      }
    })
  );
};
//  ----------- END EXPIRED SUBSCRIPTION  ------------
// ---------------------------------------------------
exports.endExpiredSubscriptions = async () => {
  const today = dayjs().format('DD/MM/YYYY');

  const allActiveSubscriptions = await Subscription.find({ isActive: true });

  if (!allActiveSubscriptions) return;

  Promise.all(
    allActiveSubscriptions.map(async (sub) => {
      if (sub.endDate === today) {
        await Subscription.findByIdAndUpdate(sub._id, {
          isActive: false,
        });
      }
    })
  );
};
