const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const checkSubscriptions = require('./utils/checkSubscriptions');
const checkTraining = require('./utils/checkTraining');
const checkExpireDate = require('./utils/checkExpireDate');
const userRouter = require('./routes/userRoutes');
const clientRouter = require('./routes/clientRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const incomeRouter = require('./routes/incomeRoutes');

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

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Check valid Subscripions
checkSubscriptions.checkSubscriptions();
checkSubscriptions.moveOldSubscription();
// Check training done
checkTraining.checkTraining();
// Check subscription expiredate
checkExpireDate.checkExpireDate();

app.use(globalErrorHandler);

module.exports = app;
