const schedule = require('node-schedule');
const dayjs = require('dayjs');
const Booking = require('../models/bookingModel');
const Subscription = require('../models/subscriptionModel');

exports.checkDoneTrainings = () => {
  //   Every 20 minutes  */20 * * * *
  schedule.scheduleJob('*/1 6-23 * * *', async () => {
    const today = dayjs().format('DD/MM/YYYY');
    const hour = dayjs().hour();
    const minute = dayjs().minute();
    const timeNow = hour * 3600 + minute * 60;

    const allBookings = await Booking.find({});

    if (!allBookings) return;

    const todayBookings = allBookings.filter(
      (booking) => booking.day.day === today
    );

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
        return;
      }
    });
  });
};
