const express = require('express');
const clientController = require('../controllers/clientController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(auth, clientController.getAllClients)
  .post(auth, clientController.createClient);

router
  .route('/:id')
  .get(auth, clientController.getClient)
  .patch(auth, clientController.updateClient)
  .delete(auth, clientController.deleteClient);

module.exports = router;
