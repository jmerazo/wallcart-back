const fs = require('fs');
const readXlsxFile = require('read-excel-file/node');
const multer = require('multer');
const path = require('path');
const db = require('../db/con_db');
const XLSX = require('xlsx');
const paymentModel = require('../models/payment');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + '/uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
    }
})

const uploadFile = multer({ storage : storage})

const filePathExFile = path.join(__dirname + '/uploads/')

const importFileToDb = (exFile) => {
    readXlsxFile(exFile).then((rows) => {
        rows.shift()
        let query = 'INSERT INTO abonos VALUES ?'
        db.query(query, [rows], (error, response) => {
            console.log(error || response)
        })
    })
}

const portfolioUpload = (exFile) => {
    console.log('XLSX: ', exFile)
    readXlsxFile(exFile).then((rows) => {
        rows.shift()
        let query = 'INSERT INTO cuentas VALUES ?'
        db.query(query, [rows], (error, response) => {
            console.log(error || response)
        })
    })
}

const portfPaymentsUpload = (exFile) => {
    console.log('XLSX: ', exFile)
    readXlsxFile(exFile).then((rows) => {
        rows.shift()
        let query = 'INSERT INTO pagos VALUES ?'
        db.query(query, [rows], (error, response) => {
            console.log(error || response)
        })
    })
}

const validateFile = (route) => {
    var paymentSuccessfull = [];
    var paymentNot = [];
    const workbook = XLSX.readFile(route);
    //console.log('Woorkbook: ',workbook)
    const workbookSheets = workbook.SheetNames;
    //console.log('Sheets workbook: ', workbookSheets);
    const sheet = workbookSheets[0];
    //console.log('Select sheet: ', sheet);
    const dataFile = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
    for (const itemRow of dataFile) {
        var nit = itemRow['nit'];
        var cto = itemRow['contrato'];
        var cta = itemRow['cuenta'];
        var fec_cta = itemRow['fec_cta'];
        var fra = itemRow['factura'];
        var val_abo = itemRow['valor_abonado'];
        var fec_abo = itemRow['fecha_abono'];
        paymentModel.validatePaymentModel(nit, cto, cta, fec_cta, fra, val_abo, fec_abo, (dataInfo, e) => {
            if(e){
                console.log('Error upload data file ==> ', e)
                res.status(500).json({message:'Error upload data file ==> ', e})
            }else{
                if(!dataInfo){
                    const dataUploadDB = {
                        nit : itemRow['nit'],
                        contrato : itemRow['contrato'],
                        cuenta : itemRow['cuenta'],
                        fecha_cuenta : itemRow['fecha_cuenta'],
                        factura : itemRow['factura'],
                        fecha_factura : itemRow['fecha_factura'],
                        fec_rad_factura: itemRow['fec_rad_factura'],
                        valor_abonado : itemRow['valor_abonado'],
                        fecha_abono : itemRow['fecha_abono'],
                        glosa_inicial : itemRow['glosa_inicial'],
                        fecha_glosa_inicial : itemRow['fecha_glosa_inicial'],
                        glosa_aceptada : itemRow['glosa_aceptada'],
                        fecha_glosa_aceptada : itemRow['fecha_glosa_aceptada']
                    }
                    paymentModel.uploadPaymentModel(dataUploadDB, (uploaded, e) => {
                        if(e){
                            console.log('Data validate upload DB error ==> ', e)
                            res.status(500).json({message: 'Data validate upload DB error ==> ',e})
                        }else{
                            console.log(uploaded);
                            paymentSuccessfull = paymentSuccessfull.concat(nit,cta,fra,val_abo,fec_abo);                        
                        }
                    })
                }else{
                    paymentNot = paymentNot.concat(nit,cta,fra,val_abo,fec_abo);
                }
            }
        })  
             
    }
    return paymentSuccessfull, paymentNot;
}

module.exports = {
    uploadFile,
    importFileToDb,
    filePathExFile,
    portfolioUpload,
    portfPaymentsUpload,
    validateFile
}