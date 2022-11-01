const { end } = require('../db/con_db');
const paymentsModel = require('../models/payment');
const agesModel = require('../models/payments_ages');

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

    //console.log('Body: ', req.body)
    //const search = {
    //    nit : req.params.nit,
    //    fi : req.params.date_init,
    //    ff : req.params.date_end
    //}
    const nit = req.params.nit;
    const fi = req.params.date_init;
    const ff = req.params.date_end;

    paymentsModel.listByParameters(nit, fi, ff, (err, data) => {
        if(err){
            res.status(500).json({message:'Error'})
        }else{
            res.status(200).json(data);
        }
    });
}

// Ages
const agesListController = async (req, res, next) => {
    var date = req.params.date
    console.log('Date: ', date);
    await agesModel.agesList(date, (data, error) => {
        if(error){
            res.status(500).json({message:'Error', error})
        }else{
            res.status(200).json(data);
        }
    })
}

const validityAgesController = async (req, res, next) => {
    var currentYear= new Date().getFullYear();
    var endYear = 1996;
    var a = []
    //console.log("Año actual: ",currentYear);
    
    //for(i=1996;1996<=currentYear;i++){
    //    console.log(a.concat(i));
//
    //    //console.log("year ",year)
    //}
    
    while(endYear <= currentYear){
        //console.log(a.concat(endYear));
        await agesModel.validityAges(endYear, (data, e) => {
            if(e){
                res.status(500).json({message:'Error: ', error})
            }else{
                a[endYear] = data;               
            }
        })
        //console.log("A: ",a)
        endYear++;
    }    
    res.status(200).json(a); 
}

module.exports = {
    listPaymentsController,
    listPaymentByNitController,
    listPaymentByFraController,
    listPaymentByDateController,
    listPaymentByParametersController,
    agesListController,
    validityAgesController
}