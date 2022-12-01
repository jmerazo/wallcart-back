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
let filePathFormat = path.join(__dirname + '/resources/')

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

function deleteFileAfterUpload(route){
    try{
        fs.unlinkSync(route)
        console.log('File removed: ', route)
    }catch(err){
        console.error('Something wrong happened removing the file', err)
    }    
}

async function beadValidateFileUp(route){
    console.log('Route: ', route)
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

            console.log(nit," - ",cto," - ",cta)
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
                console.log('Data info returned: ', dataInfo)
                if(dataInfo.length != 0){
                    console.log('Beads not loadedd: ', dataInfo)
                    beadsNot = beadsNot.concat(dataInfo)
                }else{
                    const beadsUpload = {
                        nit : itemRow['nit'],
                        contrato : itemRow['contrato'],
                        regimen : itemRow['regimen'],
                        modalidad : itemRow['modalidad'],
                        cuenta : itemRow['cuenta'],
                        fecha_cuenta : fecha_cuenta_cv,
                        fec_rad_cuenta : fec_rad_cuenta_cv,
                        valor_cuenta : itemRow['valor_cuenta']
                    }
                    console.log('Beads json: ', beadsUpload)
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
    deleteFileAfterUpload(route);
}


async function validateUpFile(route){
    var paymentSuccessfull = [];
    var paymentNot = [];

    // Llama al archivo xlsx una vez cargado
    const workbook = XLSX.readFile(route);
    // Lee la cantidad de hojas que tiene el archivo xlsx
    const workbookSheets = workbook.SheetNames;
    // Selecciona la hoja inicial
    const sheet = workbookSheets[0];
    // Se pasa los datos  a formato JSON de la hoja seleccionada
    const dataFile = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

    // Recorro todo el archivo JSON mediante el for para validar datos
    for await (const itemRow of dataFile) {

        // Datos iniciales a validar
        var nit = itemRow['nit'];
        var cto = itemRow['contrato'];
        var cta = itemRow['cuenta'];
        var fra = itemRow['factura'];

        // Convierto las fechas de formato serial a formato YYYY-MM-DD
        let fecha_cuenta_cv = null;
        var fecha_cuenta_ser = itemRow['fecha_cuenta'];
        if(fecha_cuenta_ser){
            fecha_cuenta_cv = dateSerielToFormat(fecha_cuenta_ser);
        }
        
        var fecha_factura_cv = null;
        var fecha_factura_ser = itemRow['fecha_factura']
        if(fecha_factura_ser){
            var fecha_factura_cv = dateSerielToFormat(fecha_factura_ser);
        }
        
        var fec_rad_factura_cv = null;
        var fec_rad_factura_ser = itemRow['fec_rad_factura'];
        if(fec_rad_factura_ser){
            var fec_rad_factura_cv = dateSerielToFormat(fec_rad_factura_ser);
        }
        
        var fecha_abono_cv = null;
        var fecha_abono_ser = itemRow['fecha_abono'];
        if(fecha_abono_ser){
            var fecha_abono_cv = dateSerielToFormat(fecha_abono_ser);
        }
        
        var fecha_glosa_inicial_cv = null;
        var fecha_glosa_inicial_ser = itemRow['fgi'];
        if(fecha_glosa_inicial_ser){
            var fecha_glosa_inicial_cv = dateSerielToFormat(fecha_glosa_inicial_ser);
        }
        
        var fecha_glosa_aceptada_cv = null; 
        var fecha_glosa_aceptada_ser = itemRow['fga'];
        if(fecha_glosa_aceptada_ser){
            var fecha_glosa_aceptada_cv = dateSerielToFormat(fecha_glosa_aceptada_ser);
        }

        // Valido que la factura exista
        const dataInfo = await paymentModel.validatePayUpModel(nit, cto, cta, fra)
            //console.log("Data info: ",dataInfo)

            // Obtengo el valor a abonar de la factura para validar si se puede cargar o no
            var valor_a_abonar = itemRow['valor_abonado'] + itemRow['glosa_aceptada'];

            // Si la consulta retorna información cargo el archivo de acuerdo a unos criterios
            if(dataInfo.length != 0){
                
                // Si la consulta retorna que el saldo no existe o es vacio, le asigno el valor total de la cuenta
                // de lo contrario llamo al ultimo saldo cargado
                if(dataInfo[0].saldo == ""){
                    var valor_cuenta_s = dataInfo[0].valor_cuenta; // 1000
                }else{
                    var valor_cuenta_s = dataInfo[0].saldo; 
                }
                //console.log('Valor_cuenta: ', valor_cuenta_s)
                
                //var valor_abonos = dataInfo[0].valor_abonado // 200
                //console.log('Valor_abonos: ', valor_abonos)
//
                //var valor_glosas_aceptadas = dataInfo[0].glosa_aceptada; // 100
                //console.log('Valor_glosas_aceptadas: ', valor_glosas_aceptadas)


                // Obtengo el saldo de la cuenta despues de restar al saldo anterior menos el valor a abonar actual (vr abono + vr glosa aceptada)
                var saldo_cuenta = valor_cuenta_s - valor_a_abonar; // 1000 - 200 - 100 = 700
                //console.log(`Found ${valor_cuenta_s} > ${valor_a_abonar}`)

                // 700 > 500  ==> Si cumple condición OR 500 > 700 no cumple
                // Valido si el valor de la cuenta es mayor (1000 > 500) al valor a abonar
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
                    //console.log(dataUploadDB);
                    await paymentModel.uploadPaymentModel(dataUploadDB)
                    paymentSuccessfull = paymentSuccessfull.concat(dataUploadDB);                     
                }
                paymentNot = paymentNot.concat(dataInfo);                    
            }
            
            // Si la validación no retorna información
            if(dataInfo.length === 0){
                
                // Consulto toda la información de la cuenta para obtener el valor
                const data = await paymentModel.beadList(itemRow['cuenta'])
                valor_cuenta_s = data[0].valor_cuenta;
                saldo_cuenta = data[0].valor_cuenta - valor_a_abonar;
                //console.log(`Not found: ${saldo_cuenta} > ${valor_a_abonar}`) 
                
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

                // 700 > 500  ==> Si cumple condición OR 500 > 700 no cumple
                if(saldo_cuenta > valor_a_abonar){ //INSERT nit, contrato, cuenta, fecha_cuenta, factura, fecha_factura, fec_rad_factura, valor_abonado, fecha_abono
                    
                    console.log(dataUploadDB);
                    const uploaded = await paymentModel.uploadPaymentModel(dataUploadDB)
                    console.log('Saldo inferior al abonado: ',uploaded);
                    paymentSuccessfull = paymentSuccessfull.concat(dataUploadDB);                     
                }
                paymentNot = paymentNot.concat(dataUploadDB);                         
            }                 
    }       
    await deleteFileAfterUpload(route);
    return ({paymentSuccessfull : paymentSuccessfull, paymentNot : paymentNot});
}

async function validateUpFileAll(route){
    var paymentSuccessfull = [];
    var paymentNot = [];

    const workbook = XLSX.readFile(route);
    const workbookSheets = workbook.SheetNames;
    const sheet = workbookSheets[0];
    const dataFile = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

    for await (const itemRow of dataFile) {

        var nit = itemRow['nit'];
        var cto = itemRow['contrato'];
        var cta = itemRow['cuenta'];
        var fra = itemRow['factura'];
        console.log('Nit: ',itemRow['nit'],' - Contrato: ',itemRow['contrato'],' - Cuenta: ', itemRow['cuenta'],' - Factura: ',itemRow['factura'])

        let fecha_cuenta_cv = null;
        var fecha_cuenta_ser = itemRow['fecha_cuenta'];
        if(fecha_cuenta_ser){
            fecha_cuenta_cv = dateSerielToFormat(fecha_cuenta_ser);
        }
        
        var fecha_factura_cv = null;
        var fecha_factura_ser = itemRow['fecha_factura']
        if(fecha_factura_ser){
            var fecha_factura_cv = dateSerielToFormat(fecha_factura_ser);
        }
        
        var fec_rad_factura_cv = null;
        var fec_rad_factura_ser = itemRow['fec_rad_factura'];
        if(fec_rad_factura_ser){
            var fec_rad_factura_cv = dateSerielToFormat(fec_rad_factura_ser);
        }
        
        var fecha_abono_cv = null;
        var fecha_abono_ser = itemRow['fecha_abono'];
        if(fecha_abono_ser){
            var fecha_abono_cv = dateSerielToFormat(fecha_abono_ser);
        }
        
        var fecha_glosa_inicial_cv = null;
        var fecha_glosa_inicial_ser = itemRow['fgi'];
        if(fecha_glosa_inicial_ser){
            var fecha_glosa_inicial_cv = dateSerielToFormat(fecha_glosa_inicial_ser);
        }
        
        var fecha_glosa_aceptada_cv = null; 
        var fecha_glosa_aceptada_ser = itemRow['fga'];
        if(fecha_glosa_aceptada_ser){
            var fecha_glosa_aceptada_cv = dateSerielToFormat(fecha_glosa_aceptada_ser);
        }

        let dataInfo = await paymentModel.validatePayUpModel(nit, cto, cta, fra)

        var valor_a_abonar = itemRow['valor_abonado'] + itemRow['glosa_aceptada'];

        if(dataInfo.length != 0){
            if(dataInfo[0].saldo == ""){
                console.log(dataInfo[0].valor_cuenta," - ",dataInfo[0].contrato," - ",dataInfo[0].nit)
                valor_cuenta_s = dataInfo[0].valor_cuenta;             
            }else{
                valor_cuenta_s = dataInfo[0].saldo; 
            }

            var saldo_cuenta = valor_cuenta_s - valor_a_abonar;

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
            try {
                await paymentModel.uploadPaymentModel(dataUploadDB)
                paymentSuccessfull = paymentSuccessfull.concat(dataUploadDB);                 
            } catch (error) {
                paymentNot = paymentNot.concat(dataUploadDB)                
            }                                                 
        }
        
        if(dataInfo.length === 0){
            const data = await paymentModel.beadList(itemRow['nit'], itemRow['contrato'], itemRow['cuenta'])
            
            if(data.length != 0){
                console.log(data[0].valor_cuenta," - ",data[0].contrato," - ",data[0].nit)
                valor_cuenta_s = data[0].valor_cuenta;                    
                saldo_cuenta = data[0].valor_cuenta - valor_a_abonar;
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
                await paymentModel.uploadPaymentModel(dataUploadDB)
                paymentSuccessfull = paymentSuccessfull.concat(dataUploadDB);   
            }
            if(data.length === 0){
                saldo_cuenta = 0;
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
                paymentNot = paymentNot.concat(dataUploadDB)
            }            
        }                 
    }       
    await deleteFileAfterUpload(route);
    return ({paymentSuccessfull : paymentSuccessfull, paymentNot : paymentNot});
}

async function commentValidateFileUp(route){
    var commentSuccessfull = [];
    var commentNot = [];
    const workbook = XLSX.readFile(route);
    const workbookSheets = workbook.SheetNames;
    const sheet = workbookSheets[0];
    const beadFile = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

    for await (const itemRow of beadFile) {
        var nit = itemRow['nit'];
        var cto = itemRow['contrato'];
        var cta = itemRow['cuenta'];

        console.log(nit," - ",cto," - ",cta)
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
        
        let commentSearch = await paymentModel.validateBeadUpModel(nit, cto, cta)
        console.log('Data info returned: ', dataInfo)
        if(commentSearch.length != 0){
            console.log('Beads not loadedd: ', dataInfo)
            beadsNot = beadsNot.concat(dataInfo)
        }

        if(commentSearch.length == 0){
            const beadsUpload = {
                nit : itemRow['nit'],
                contrato : itemRow['contrato'],
                regimen : itemRow['regimen'],
                modalidad : itemRow['modalidad'],
                cuenta : itemRow['cuenta'],
                fecha_cuenta : fecha_cuenta_cv,
                fec_rad_cuenta : fec_rad_cuenta_cv,
                valor_cuenta : itemRow['valor_cuenta']
            }
            console.log('Beads json: ', beadsUpload)
            
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
    }       
    deleteFileAfterUpload(route);
    return ({commentSuccessfull : commentSuccessfull, commentNot : commentNot});
} 

module.exports = {
    uploadFile,
    importFileToDb,
    filePathExFile,
    portfolioUpload,
    portfPaymentsUpload,
    validateFile,
    validateUpFile,
    beadValidateFileUp,
    filePathFormat,
    commentValidateFileUp,
    validateUpFileAll
}