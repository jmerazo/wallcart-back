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
                        paymentSuccessfull = paymentSuccessfull.concat(dataUploadDB);                     
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

async function beadValidateFileUp(route){
    var beadsSuccessfull = [];
    var beadsNot = [];
    const workbook = XLSX.readFile(route);
    const workbookSheets = workbook.SheetNames;
    const sheet = workbookSheets[0];
    const beadFile = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
    return new Promise((resolve, reject) => {
        for (const itemRow of beadFile) {
            var nit = itemRow['nit'];
            var cto = itemRow['contrato'];
            var cta = itemRow['cuenta'];

            var fecha_cuenta_ser = itemRow['fecha_cuenta']
            if(fecha_cuenta_ser == ""){
                var fecha_cuenta_cv = null;
            }else{
                var fecha_cuenta_cv = dateSerielToFormat(fecha_cuenta_ser);
            }
            
            var fecha_rad_cuenta_ser = itemRow['fec_rad_cuenta']
            if(fecha_rad_cuenta_ser == ""){
                var fec_rad_cuenta_cv = null;
            }else{
                var fec_rad_cuenta_cv = dateSerielToFormat(fecha_rad_cuenta_ser);
            }           
            
            paymentModel.validateBeadUpModel(nit, cto, cta)
            .then((dataInfo) => {
                if(dataInfo.length != 0){
                    beadsNot = beadsNot.concat(dataInfo)
                }else{
                    const beadsUpload = {
                        nit : itemRow['nit'],
                        contrato : itemRow['contrato'],
                        regimen : itemRow['regimen'],
                        modalidad : itemRow['modalidad'],
                        cuenta : itemRow['cuenta'],
                        fecha_cuenta : fecha_cuenta_cv,
                        fecha_rad_cuenta : fec_rad_cuenta_cv,
                        valor_cuenta : itemRow['valor_cuenta']
                    }

                    paymentModel.uploadBeadsModel(beadsUpload)
                    .then((uploaded) => {
                        console.log('Loaded: ',uploaded);
                        beadsSuccessfull = beadsSuccessfull.concat(beadsUpload);                     
                    })
                    .catch((e) => {
                        console.log('Data validate upload DB error ==> ', e)
                        reject(e);
                    })
                }
                setTimeout(() => {resolve({beadsSuccessfull : beadsSuccessfull, beadsNot : beadsNot}); },2000) 
            })
            .catch((e) => {
                return e;
            })                                             
        }       
    })
}

async function validateUpFile(route){
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
            if(fecha_cuenta_ser == "" || fecha_abono_ser == undefined){
                var fecha_cuenta_cv = null;
            }else{
                var fecha_cuenta_cv = dateSerielToFormat(fecha_cuenta_ser);
            }
            
            var fecha_factura_ser = itemRow['fecha_factura']
            if(fecha_factura_ser == "" || fecha_abono_ser == undefined){
                var fecha_factura_cv = null;
            }else{
                var fecha_factura_cv = dateSerielToFormat(fecha_factura_ser);
            }
            
            var fec_rad_factura_ser = itemRow['fec_rad_factura'];
            if(fec_rad_factura_ser == "" || fecha_abono_ser == undefined){
                var fec_rad_factura_cv = null;
            }else{
                var fec_rad_factura_cv = dateSerielToFormat(fec_rad_factura_ser);
            }
            
            var fecha_abono_ser = itemRow['fecha_abono'];
            if(fecha_abono_ser == "" || fecha_abono_ser == undefined){
                var fecha_abono_cv = null;
            }else{
                var fecha_abono_cv = dateSerielToFormat(fecha_abono_ser);
            }
            
            var fecha_glosa_inicial_ser = itemRow['fgi'];
            console.log(fecha_glosa_inicial_ser);
            if(fecha_glosa_inicial_ser == "" || fecha_abono_ser == undefined){
                var fecha_glosa_inicial_cv = null;
            }else{
                var fecha_glosa_inicial_cv = dateSerielToFormat(fecha_glosa_inicial_ser);
            }
            
            var fecha_glosa_aceptada_ser = itemRow['fga'];
            console.log(fecha_glosa_aceptada_ser)
            if(fecha_glosa_aceptada_ser == "" || fecha_abono_ser == undefined){
                var fecha_glosa_aceptada_cv = null;                
            }else{
                var fecha_glosa_aceptada_cv = dateSerielToFormat(fecha_glosa_aceptada_ser);
            }

            paymentModel.validatePayUpModel(nit, cto, cta, fra)
            .then((dataInfo) => {
                //console.log(dataInfo)
                var valor_a_abonar = itemRow['valor_abonado'] + itemRow['glosa_aceptada']; // 500
                if(dataInfo.length != 0){
                    
                    if(dataInfo[0].saldo == ""){
                        var valor_cuenta_s = dataInfo[0].valor_cuenta; // 1000
                    }else{
                        var valor_cuenta_s = dataInfo[0].saldo; 
                    }
                    console.log('Valor_cuenta: ', valor_cuenta_s)
                    
                    var valor_abonos = dataInfo[0].valor_abonado // 200
                    console.log('Valor_abonos: ', valor_abonos)

                    var valor_glosas_aceptadas = dataInfo[0].glosa_aceptada; // 100
                    console.log('Valor_glosas_aceptadas: ', valor_glosas_aceptadas)

                    var saldo_cuenta = valor_cuenta_s - itemRow['valor_abonado'] - itemRow['glosa_aceptada']; // 1000 - 200 - 100 = 700
                    
                    console.log(`Found ${valor_cuenta_s} > ${valor_a_abonar}`)

                    // 700 > 500  ==> Si cumple condición OR 500 > 700 no cumple
                    if(valor_cuenta_s > valor_a_abonar){ //INSERT nit, contrato, cuenta, fecha_cuenta, factura, fecha_factura, fec_rad_factura, valor_abonado, fecha_abono
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
                            fgi : fecha_glosa_inicial_cv,
                            glosa_aceptada : itemRow['glosa_aceptada'],
                            fga : fecha_glosa_aceptada_cv,
                            saldo : saldo_cuenta
                        }
                        console.log(dataUploadDB);
                        paymentModel.uploadPaymentModel(dataUploadDB)
                        .then((uploaded) => {
                            //console.log('Saldo inferior al abonado: ',uploaded);
                            paymentSuccessfull = paymentSuccessfull.concat(dataUploadDB);                     
                        })
                        .catch((e) => {
                            console.log('Data validate upload DB error ==> ', e)
                            reject(e);
                        })
                    }else{
                        paymentNot = paymentNot.concat(dataInfo);                   
                    }
                }
                
                if(dataInfo.length === 0){
                    paymentModel.beadList(itemRow['cuenta'])
                    .then((data) => {
                        console.log('data: ',data)
                        valor_cuenta_s = data[0].valor_cuenta;
                        saldo_cuenta = data[0].valor_cuenta - valor_a_abonar - itemRow['glosa_aceptada'];
                        console.log(`Not found: ${saldo_cuenta} > ${valor_a_abonar}`)                       

                        // 700 > 500  ==> Si cumple condición OR 500 > 700 no cumple
                        if(saldo_cuenta > valor_a_abonar){ //INSERT nit, contrato, cuenta, fecha_cuenta, factura, fecha_factura, fec_rad_factura, valor_abonado, fecha_abono
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
                                fgi : fecha_glosa_inicial_cv,
                                glosa_aceptada : itemRow['glosa_aceptada'],
                                fga : fecha_glosa_aceptada_cv,
                                saldo : saldo_cuenta
                            }
                            console.log(dataUploadDB);
                            paymentModel.uploadPaymentModel(dataUploadDB)
                            .then((uploaded) => {
                                console.log('Saldo inferior al abonado: ',uploaded);
                                paymentSuccessfull = paymentSuccessfull.concat(dataUploadDB);                     
                            })
                            .catch((e) => {
                                console.log('Data validate upload DB error ==> ', e)
                                reject(e);
                            })
                        }else{
                            paymentNot = paymentNot.concat(dataInfo);                   
                        }
                    })
                    .catch((e) => {
                        //console.log(`Bead not found: `, e)
                        reject(e)
                    })
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
    validateFile,
    validateUpFile,
    beadValidateFileUp
}