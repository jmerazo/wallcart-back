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
    var date_info = new Date(utc_value * 1000),
    month = '' + (date_info.getMonth() + 1),
    day = '' + date_info.getDate(),
    year = date_info.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
 }

async function validateFile(route){
    var paymentSuccessfull = [];
    var paymentNot = [];
    const workbook = XLSX.readFile(route);
    const workbookSheets = workbook.SheetNames;
    const sheet = workbookSheets[0];
    const dataFile = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
    return new Promise((resolve, reject) => {
        for (const itemRow of dataFile) {
            var nit = itemRow['nit'];
            var cto = itemRow['contrato'];
            var cta = itemRow['cuenta'];
            var fra = itemRow['factura'];
            var val_abo = itemRow['valor_abonado'];
            var fecha_cuenta_ser = itemRow['fecha_cuenta'];
            if(fecha_cuenta_ser == ""){
                var fecha_cuenta_cv = null;
            }else{
                var fecha_cuenta_cv = dateSerielToFormat(fecha_cuenta_ser);
            }
            
            var fecha_factura_ser = itemRow['fecha_factura']
            if(fecha_factura_ser == ""){
                var fecha_factura_cv = null;
            }else{
                var fecha_factura_cv = dateSerielToFormat(fecha_factura_ser);
            }
            
            var fec_rad_factura_ser = itemRow['fec_rad_factura'];
            if(fec_rad_factura_ser == ""){
                var fec_rad_factura_cv = null;
            }else{
                var fec_rad_factura_cv = dateSerielToFormat(fec_rad_factura_ser);
            }
            
            var fecha_abono_ser = itemRow['fecha_abono'];
            if(fecha_abono_ser == ""){
                var fecha_abono_cv = null;
            }else{
                var fecha_abono_cv = dateSerielToFormat(fecha_abono_ser);
            }
            
            var fecha_glosa_inicial_ser = itemRow['fecha_glosa_inicial'];
            if(fecha_glosa_inicial_ser == ""){
                var fecha_glosa_inicial_cv = null;
            }else{
                var fecha_glosa_inicial_cv = dateSerielToFormat(fecha_glosa_inicial_ser);
            }
            
            var fecha_glosa_aceptada_ser = itemRow['fecha_glosa_aceptada'];
            if(fecha_glosa_aceptada_ser == ""){
                var fecha_glosa_aceptada_cv = null;
            }else{
                var fecha_glosa_aceptada_cv = dateSerielToFormat(fecha_glosa_aceptada_ser);
            }

            paymentModel.validatePaymentModel(nit, cto, cta, fra, val_abo)
            .then((dataInfo) => {
                if(dataInfo.length === 0){
                    const dataUploadDB = {
                        nit : itemRow['nit'],
                        contrato : itemRow['contrato'],
                        cuenta : itemRow['cuenta'],
                        fecha_cuenta : fecha_cuenta_cv,
                        factura : itemRow['factura'],
                        fecha_factura : fecha_factura_cv,
                        fec_rad_factura: fec_rad_factura_cv,
                        valor_abonado : itemRow['valor_abonado'],
                        fecha_abono : fecha_abono_cv,
                        glosa_inicial : itemRow['glosa_inicial'],
                        fecha_glosa_inicial : fecha_glosa_inicial_cv,
                        glosa_aceptada : itemRow['glosa_aceptada'],
                        fecha_glosa_aceptada : fecha_glosa_aceptada_cv
                    }
                    paymentModel.uploadPaymentModel(dataUploadDB)
                    .then((uploaded) => {
                        console.log('No existe y se carga: ',uploaded);
                        paymentSuccessfull = paymentSuccessfull.concat(uploaded);                     
                    })
                    .catch((e) => {
                        console.log('Data validate upload DB error ==> ', e)
                        reject(e);
                    })                   
                }else{
                    paymentNot = paymentNot.concat(dataInfo);                   
                }
                setTimeout(() => {resolve({paymentSuccessfull : paymentSuccessfull, paymentNot : paymentNot}); },2000)              
            })                        
        }       
    })
}
module.exports = {
    uploadFile,
    importFileToDb,
    filePathExFile,
    portfolioUpload,
    portfPaymentsUpload,
    validateFile
}