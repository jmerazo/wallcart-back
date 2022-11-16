const { Router } = require('express');
const router = Router();
const paymentsController = require('../controllers/payment');
const uploadFileHelper = require('../Helpers/uploadFile');
const authController = require('../controllers/auth');
const portfolioController = require('../controllers/portfolio')
const cors = require('cors')
const corsOptions = require('../Helpers/cors');

// Route information to connect API
router.get('/', cors(corsOptions), (req, res) => {res.status(200).json({ message: 'Connect to our API'})});

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
router.get('/report/ages/:date', paymentsController.agesListController);

// Validity report
router.get('/validity/report/:year', paymentsController.validityAgesController);

// User
router.get('/user/:id', authController.listUserByIdController);

// Portfolio
router.get('/portfolio/all', portfolioController.listPortfolioController);
router.get('/portfolio/nit/:nit', portfolioController.listPortfolioByNitController);
router.get('/portfolio/sales/:fra', portfolioController.listPortfolioByFraController);
router.get('/portfolio/date/:date', portfolioController.listPortfolioByDateController);
router.get('/portfolio/search/:nit/:date_init/:date_end', portfolioController.listPortfolioByParametersController);
router.get('/portfolio/ages/:date', portfolioController.listAgesPortfolioController);
router.get('/portfolio/params/:col/:param', portfolioController.listParametersController);
router.get('/portfolio/consolidated', portfolioController.listConsolidatedController);
router.post('/portfolio/upload-excel/beads', uploadFileHelper.uploadFile.single('p-upload-excel'), (req, res) => {
    uploadFileHelper.beadValidateFileUp(uploadFileHelper.filePathExFile + req.file.filename)
    .then((result) => {
        res.status(200).json(result)    
    })
    .catch((e) => {
        console.log('Error: ',e)
    });
})
router.post('/portfolio/upload-excel/payments', uploadFileHelper.uploadFile.single('p-upload-excel'), (req, res) => {
    uploadFileHelper.validateUpFile(uploadFileHelper.filePathExFile + req.file.filename)
    .then((result) => {
        //console.log('Result: ', result)
        res.status(200).json(result)
        //setTimeout(()=>{
        //    console.log('Result: ', result)
        //    res.status(200).json(result)
        //;} , 2500);        
    })
    .catch((e) => {
        console.log('Error: ',e)
    });
})




module.exports = router;