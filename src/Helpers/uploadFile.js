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

function dateSerielToFormat(serial) {
    var utc_days  = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;                                        
    var date_info = new Date(utc_value * 1000);
 
    var fractional_day = serial - Math.floor(serial) + 0.0000001;
 
    var total_seconds = Math.floor(86400 * fractional_day);
 
    var seconds = total_seconds % 60;
 
    total_seconds -= seconds;
 
    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;
 
    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
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
        //console.log('Nit: ', nit);
        var cto = itemRow['contrato'];
        //console.log('Contrato: ', cto);
        var cta = itemRow['cuenta'];
        //console.log('Cuenta: ', cta);
        var fra = itemRow['factura'];
        //console.log('Factura: ', fra);
        var val_abo = itemRow['valor_abonado'];
        //console.log('Valor abonado: ', val_abo);
        paymentModel.validatePaymentModel(nit, cto, cta, fra, val_abo, (e, dataInfo) => {
            if(e){
                console.log('Error validation data file ==> ', e)
                //res.status(500).json({message:'Error upload data file ==> ', e})
            }else{
                //console.log('Data info: ', dataInfo)
                if(dataInfo.length === 0){
                    console.log("Datainfo not: ",dataInfo)
                    var fecha_cuenta_serial = itemRow['fecha_cuenta']
                    var fecha_factura_serial = itemRow['fecha_factura']
                    var fec_rad_factura_serial = itemRow['fec_rad_factura']
                    var fecha_abono_serial = itemRow['fecha_abono']
                    var fecha_glosa_inicial = itemRow['fecha_glosa_inicial']
                    var fecha_glosa_aceptada_serial = itemRow['fecha_glosa_aceptada']
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
                    console.log("Data to upload: ", dataUploadDB);
                    paymentModel.uploadPaymentModel(dataUploadDB, (uploaded, e) => {
                        if(e){
                            console.log('Data validate upload DB error ==> ', e)
                            res.status(500).json({message: 'Data validate upload DB error ==> ',e})
                        }else{
                            console.log(uploaded);
                            paymentSuccessfull = paymentSuccessfull.concat(nit,cta,fra,val_abo);                      
                        }
                    })                   
                }else{
                    console.log('Datainfo yes: ',dataInfo);
                    paymentNot = paymentNot.concat(nit,cta,fra,val_abo);                     
                }
            }
        })  
             
    }
    console.log('Pagos cargados: ', paymentSuccessfull);
    console.log('Pagos duplicados: ', paymentNot);
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