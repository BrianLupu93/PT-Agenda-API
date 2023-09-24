const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');
const axios = require('axios');

const userRouter = require('./routes/userRoutes');
const clientRouter = require('./routes/clientRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const incomeRouter = require('./routes/incomeRoutes');
const subscriptionRouter = require('./routes/subscriptionRoutes');

const scheduledJobs = require('./cron-jobs/scheduledJobs');

const app = express();

// Implement CORS
app.use(cors());

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser, reading data from body into req.body
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/clients', clientRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/incomes', incomeRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);

app.all('*', (req, res, next) => {
  if (res.status.toString()[0] === '4' || res.status.toString()[0] === '5') {
    res.status(404).json({
      status: 'ERROR',
      message: `Can't find ${req.originalUrl} on this server!`,
    });
  }
  next();
});

//  CHECK DONE TRAINGS -> Every 15 minutes between 6AM and 23PM  */15 6-23 * * *
schedule.scheduleJob('*/15 6-23 * * *', () => {
  scheduledJobs.checkDoneTrainings();
});

//  CHECK SUBSCRIPTION EXPIRE DATE -> Every morning at 1AM  0 1 * * *
schedule.scheduleJob('0 1 * * *', () => {
  scheduledJobs.checkExpireDate();
});

//  END EXPIRED SUBSCRIPTIONS -> Every evening at 23:10 PM  10 23 * * *
schedule.scheduleJob('10 23 * * *', () => {
  scheduledJobs.endExpiredSubscriptions();
});

//  END EXPIRED SUBSCRIPTIONS -> Every evening at 23:10 PM  10 23 * * *
schedule.scheduleJob('*/1 * * * *', async () => {
  console.log('sending');
  // await sendSms();
});

module.exports = app;
