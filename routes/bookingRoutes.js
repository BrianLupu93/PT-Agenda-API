const express = require('express');
const bookingController = require('../controllers/bookingController');
const middlewares = require('../middleware/middlewares');

const router = express.Router();

router.route('/amount').get(bookingController.getBookingAmount);
router
  .route('/:id')
  .get(middlewares.auth, bookingController.getTodayBookings)
  .patch(middlewares.auth, bookingController.deleteBooking);

router
  .route('/update/:id')
  .patch(middlewares.auth, bookingController.upadateBooking);

// router
//   .route('/:id')
//   .get(clientController.getClient)
//   .patch(middlewares.bookingAction, clientController.updateClient)
//   .delete(clientController.deleteClient);

module.exports = router;
