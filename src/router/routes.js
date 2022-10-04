const { Router } = require('express');
const router = Router();
const paymentsController = require('../controllers/payment');

// Route information to connect API
router.get('/', function(req, res){res.status(200).json({ message: 'Connect to our API'})});

// Payments
router.get('/payments/all', paymentsController.listPaymentsController);
router.get('/payments/nit/:nit', paymentsController.listPaymentByNitController);
router.get('/payments/sales/:fra', paymentsController.listPaymentByFraController);
router.get('/payments/date/:date', paymentsController.listPaymentByDateController);
router.get('/payments/search', paymentsController.listPaymentByParametersController);

module.exports = router;