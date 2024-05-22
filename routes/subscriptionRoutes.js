const express = require('express');
const subscriptionController = require('../controllers/subscriptionController');
const { auth } = require('../middleware/auth');
const { createBookings } = require('../middleware/createBookings');
const { createIncome } = require('../middleware/createIncome');
const {
  checkActiveSubscription,
} = require('../middleware/checkActiveSubscription');

const router = express.Router();

router
  .route('/')
  .get(auth, subscriptionController.getAllSubscriptions)
  .post(
    auth,
    checkActiveSubscription,
    subscriptionController.createSubscription,
    createBookings,
    createIncome
  );

router
  .route('/active')
  .get(auth, subscriptionController.getAllActiveSubscriptions);

router
  .route('/:id')
  .get(auth, subscriptionController.getSubscription)
  .patch(auth, subscriptionController.updateSubscription)
  .delete(auth, subscriptionController.deleteSubscription);

router
  .route('/expired/:id')
  .post(auth, subscriptionController.updateExpiredSubscription, createIncome);

router
  .route('/postpone/:id')
  .patch(auth, subscriptionController.postponeSubscription);

module.exports = router;
