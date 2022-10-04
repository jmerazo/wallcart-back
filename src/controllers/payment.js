const paymentsModel = require('../models/payment');

const listPaymentsController = async (req, res, next) => {
    await paymentsModel.listPayments(function(err, data){
        res.status(200).json(data);
    });    
}

const listPaymentByNitController = async (req, res, next) => {
    const nit = req.params.nit;
    console.log("Id: ", req.params.nit);
    paymentsModel.listPaymentByNit(nit, (err, data) => {
        if(err){
            res.status(500).json({message:'Error'})
        }else{
            res.status(200).json(data);
        }
    });
}

const listPaymentByFraController = async (req, res, next) => {
    const fra = req.params.fra;
    console.log("Fra: ", req.params.fra);
    paymentsModel.listPaymentByFra(fra, (err, data) => {
        if(err){
            res.status(500).json({message:'Error'})
        }else{
            res.status(200).json(data);
        }
    });
}

const listPaymentByDateController = async (req, res, next) => {
    const date = req.params.date;
    console.log("Date: ", req.params.date);
    paymentsModel.listPaymentByDate(date, (err, data) => {
        if(err){
            res.status(500).json({message:'Error'})
        }else{
            res.status(200).json(data);
        }
    });
}

const listPaymentByParametersController = async (req, res, next) => {

    console.log('Nit: ', req.body)
    const search = {
        nit : req.body.search.nit,
        fi : req.body.search.date_init,
        ff : req.body.search.date_end
    }

    paymentsModel.listPaymentByParameters(search, (err, data) => {
        if(err){
            res.status(500).json({message:'Error'})
        }else{
            res.status(200).json(data);
        }
    });
}


module.exports = {
    listPaymentsController,
    listPaymentByNitController,
    listPaymentByFraController,
    listPaymentByDateController,
    listPaymentByParametersController
}