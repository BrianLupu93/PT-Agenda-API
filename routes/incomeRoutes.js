const express = require('express');
const incomeController = require('../controllers/incomeController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(auth, incomeController.getAllIncomes)
  .post(auth, incomeController.createIncome);
router.route('/:id').delete(auth, incomeController.deleteIncome);

module.exports = router;
