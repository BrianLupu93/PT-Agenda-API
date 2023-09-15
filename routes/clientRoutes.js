const express = require('express');
const clientController = require('../controllers/clientController');
const middlewares = require('../middleware/middlewares');
const auth = require('../middleware/middlewares');

const router = express.Router();

router
  .route('/')
  .get(middlewares.auth, clientController.getAllClients)
  .post(middlewares.auth, clientController.createClient);

router
  .route('/:id')
  .get(middlewares.auth, clientController.getClient)
  .patch(
    middlewares.auth,
    middlewares.bookingAction,
    clientController.updateClient
  )
  .delete(middlewares.auth, clientController.deleteClient);

router
  .route('/subscription/:id')
  .patch(
    middlewares.auth,
    middlewares.moveOldSubscription,
    middlewares.bookingAction,
    clientController.updateSubscription
  )
  .delete(middlewares.auth, clientController.deleteSubscription);

module.exports = router;
