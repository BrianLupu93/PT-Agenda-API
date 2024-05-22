const { checkExpireDate } = require('../cron-jobs/scheduledJobs');
const Subscription = require('../models/subscriptionModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('../utils/handleFactory');
const dayjs = require('dayjs');

exports.getAllSubscriptions = factory.getAll(Subscription);
exports.getSubscription = factory.getOne(Subscription);
exports.updateSubscription = factory.updateOne(Subscription);
exports.deleteSubscription = factory.deleteOne(Subscription);

exports.getAllActiveSubscriptions = catchAsync(async (req, res, next) => {
  const activeSubscriptions = await Subscription.find({ isActive: true });

  if (activeSubscriptions.length === 0) {
    return res.status(200).json({
      status: 'success',
      message: 'No Active Subscriptions',
    });
  }
  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    data: activeSubscriptions,
  });
});

exports.createSubscription = catchAsync(async (req, res, next) => {
  const doc = await Subscription.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
  next();
});

exports.updateExpiredSubscription = catchAsync(async (req, res, next) => {
  await Subscription.findByIdAndUpdate(req.params.id, { isActive: true });

  await Subscription.create(req.body);
  res.status(201).json({
    status: 'success',
    message: 'Expired subscription updated',
  });
  next();
});

exports.postponeSubscription = catchAsync(async (req, res, next) => {
  const foundedSubscription = await Subscription.findById(req.params.id);
  const endDate = req.body.endDate;

  if (!foundedSubscription) {
    return res.status(200).json({
      status: 'fail',
      message: 'No subscription founded!',
    });
  }

  const today = dayjs().format('DD/MM/YYYY');
  const oneDayBefore = dayjs().add(1, 'day').format('DD/MM/YYYY');
  const twoDaysBefore = dayjs().add(2, 'day').format('DD/MM/YYYY');
  const threeDaysBefore = dayjs().add(3, 'day').format('DD/MM/YYYY');

  const subEndDay = parseInt(endDate.slice(0, 2));
  const subEndMonth = parseInt(endDate.slice(3, 5)) - 1;
  const subEndYear = parseInt(endDate.slice(6, 10));

  const subEndDate = dayjs()
    .set('date', subEndDay)
    .set('month', subEndMonth)
    .set('year', subEndYear)
    .format('DD/MM/YYYY');

  let newAlertMessage;

  // 3 DAYS BEFORE EXPIRE DATE
  if (subEndDate === threeDaysBefore) {
    newAlertMessage = 'Expira: 3 zile';
  }
  // 2 DAYS BEFORE EXPIRE DATE
  else if (subEndDate === twoDaysBefore) {
    newAlertMessage = 'Expira: 2 zile';
  }
  // 1 DAY BEFORE EXPIRE DATE
  else if (subEndDate === oneDayBefore) {
    newAlertMessage = 'Expira: 1 zi';
  }
  // TODAY IS THE EXPIRATION DAY
  else if (subEndDate === today) {
    newAlertMessage = 'Expira: AZI';
  } else {
    newAlertMessage = 'ACTIV';
  }

  await Subscription.findByIdAndUpdate(req.params.id, {
    endDate: endDate,
    alertMessage: newAlertMessage,
  });

  res.status(200).json({
    status: 'success',
    message: 'Subscription postponed',
  });
});
