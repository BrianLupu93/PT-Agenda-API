const express = require('express');
const incomeController = require('../controllers/incomeController');
const middlewares = require('../middleware/middlewares');

const router = express.Router();

router.route('/').get(middlewares.auth, incomeController.getIncomesYears);

router
  .route('/:id')
  .post(middlewares.auth, incomeController.registerIncome)
  .get(middlewares.auth, incomeController.getIncomeByYear);

module.exports = router;
