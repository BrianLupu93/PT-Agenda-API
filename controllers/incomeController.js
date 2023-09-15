const Income = require('../models/incomeModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const months = [
  'Ianuarie',
  'Februarie',
  'Martie',
  'Aprilie',
  'Mai',
  'Iunie',
  'Iulie',
  'August',
  'Septembrie',
  'Octombrie',
  'Noiembrie',
  'Decembrie',
];

exports.getIncomesYears = catchAsync(async (req, res, next) => {
  const years = await Income.find({});

  if (!years) return next(new AppError('No Bookings', 404));
  const resData = years.map((el) => el.year);

  return res.status(200).json({
    status: 'success',
    years: resData,
  });
});

exports.getIncomeByYear = catchAsync(async (req, res, next) => {
  const yearFound = await Income.findOne({ year: req.params.id });

  if (!yearFound) return next(new AppError('No Bookings', 404));

  return res.status(200).json({
    status: 'success',
    year: yearFound,
  });
});

exports.registerIncome = catchAsync(async (req, res, next) => {
  const client = {
    name: req.body.name,
    clientId: req.params.id,
    price: parseInt(req.body.subscription[0].price),
    startDate: req.body.subscription[0].startDate,
  };

  const subscription = req.body.subscription[0];
  const reqYear = subscription.startDate.slice(6, 10);
  const reqMonth = parseInt(subscription.startDate.slice(3, 5));

  const existYear = await Income.findOne({ year: reqYear });

  if (!existYear) {
    await Income.create({
      year: reqYear,
      months: [
        {
          name: months[reqMonth - 1],
          clients: [client],
          total: client.price,
        },
      ],
    });
  }

  if (existYear) {
    const existMonth = existYear.months.findIndex(
      (month) => month.name === months[reqMonth - 1]
    );

    if (existMonth >= 0) {
      let total;
      if (existYear.months[existMonth].clients.length > 1) {
        total = existYear.months[existMonth].clients.reduce(
          (a, b) => a.price + b.price
        );
        total += client.price;
      }
      if (existYear.months[existMonth].clients.length === 1) {
        total = existYear.months[existMonth].clients[0].price + client.price;
      }
      if (existYear.months[existMonth].clients.length === 0) {
        total = client.price;
      }

      await Income.findOneAndUpdate(
        { year: reqYear },
        {
          $push: { [`months.${existMonth}.clients`]: client },
          [`months.${existMonth}.total`]: total,
        }
      );
    }
    if (existMonth < 0) {
      await Income.findOneAndUpdate(
        { year: reqYear },
        {
          $push: {
            months: {
              name: months[reqMonth - 1],
              clients: [client],
              total: client.price,
            },
          },
        }
      );
    }
  }

  return res.status(200).json({
    status: 'success',
    message: 'Income added',
  });
});
