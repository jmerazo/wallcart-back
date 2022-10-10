const { Router } = require('express');
const router = Router();
const paymentsController = require('../controllers/payment');
const uploadFileHelper = require('../Helpers/uploadFile');

// Route information to connect API
router.get('/', function(req, res){res.status(200).json({ message: 'Connect to our API'})});

// Payments
router.get('/payments/all', paymentsController.listPaymentsController);
router.get('/payments/nit/:nit', paymentsController.listPaymentByNitController);
router.get('/payments/sales/:fra', paymentsController.listPaymentByFraController);
router.get('/payments/date/:date', paymentsController.listPaymentByDateController);
router.get('/payments/search/:nit/:date_init/:date_end', paymentsController.listPaymentByParametersController);

// Uploads
router.post('/upload-excel', uploadFileHelper.uploadFile.single('upload-excel'), (req, res) => {
    uploadFileHelper.importFileToDb(uploadFileHelper.filePathExFile + req.file.filename)
    res.status(200).send('Successfull upload file xlsx')
})

// Ages report
router.get('/report/ages', paymentsController.agesListController);

module.exports = router;