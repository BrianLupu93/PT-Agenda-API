const express = require('express');
const bookingController = require('../controllers/bookingController');
const { auth } = require('../middleware/auth');
const { deleteIncomes } = require('../middleware/deleteIncomes');

const router = express.Router();

router
  .route('/')
  .get(auth, bookingController.getAllBookings)
  .post(auth, bookingController.createBooking);

router
  .route('/:id')
  .get(auth, bookingController.getBooking)
  .patch(auth, bookingController.updateBooking)
  .delete(auth, bookingController.deleteBooking);

router
  .route('/delete-all/:id')
  .delete(auth, bookingController.deleteAllBookings, deleteIncomes);

module.exports = router;
