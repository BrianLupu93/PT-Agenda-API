const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

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
  res.status(404).json({
    status: 'success',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
  next();
});

scheduledJobs.checkDoneTrainings();

module.exports = app;
