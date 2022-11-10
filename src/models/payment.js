const connection = require('../db/con_db');

//List users all
const listPayments = async function(result) {
    await connection.query('SELECT * FROM abonosyotrasfras ORDER BY fecha_pago desc LIMIT 200 OFFSET 200', (error, payments) => {
		if(error){
			return result(error, null);
		}else{
			return result(null, payments);
		}
	});
}

//List Payment by Nit
const listPaymentByNit = async function(nit, result) {
    console.log("Nit model: ", nit);
    await connection.query(`SELECT * FROM abonosyotrasfras WHERE nit LIKE '%${nit}%'`, (error, payments) => {
		if(error){
			return result(error, null);
		}else{
			return result(null, payments);
		}
	});
}

//List Payment by Sale
const listPaymentByFra = async function(fra, result) {
    console.log("Nit model: ", fra);
    await connection.query(`SELECT * FROM abonosyotrasfras WHERE factura = ${fra}`, (error, payments) => {
		if(error){
			return result(error, null);
		}else{
			return result(null, payments);
		}
	});
}

//List Payment by Sale
const listPaymentByDate = async function(date, result) {
    console.log("Nit model: ", date);
    await connection.query(`SELECT * FROM abonosyotrasfras WHERE fecha_pago = "${date}"`, (error, payments) => {
		if(error){
			return result(error, null);
		}else{
			return result(null, payments);
		}
	});
}

const listByParameters = async (nit, fi, ff, result) => {
	await connection.query(`SELECT * FROM abonosyotrasfras WHERE nit LIKE ${nit} AND fecha_pago > '${fi}' AND fecha_pago < '${ff}'`, (error, payments) => {
		if(error){
			return result(error, null);
		}else{
			return result(null, payments);
		}
	})
}

const validatePaymentModel = async (nit, cto, cta, fec_cta, fra, val_abo, fec_abo, result) => {
	await connection.query(`SELECT 
							nit, contrato, cuenta, fecha_cuenta, factura, valor_total_factura, valor_abonado, fecha_abono 
							FROM cartera 
							WHERE nit = '${nit}' 
							AND contrato = '${cto}' 
							AND cuenta = '${cta}' 
							AND fecha_cuenta = "${fec_cta}" 
							AND factura = "${fra}" 
							AND valor_abonado = '${val_abo}' 
							AND fecha_abono = "${fec_abo}"`, (error, validatePay) => {
		if(error){
			return result(error, null);
		}else{
			return result(null, validatePay);
		}
	})
}

const uploadPaymentModel = async (dataUpload, result) => {
	await connection.query('INSERT INTO cartera SET ?', dataUpload, (error, upload) => {
		if(error){			
			return result(error, null);
		}else{
			console.log("Data upload: ",upload.insertId);
			return result(null, upload.insertId);
		}
	});
}



module.exports = {
    listPayments,
    listPaymentByNit,
    listPaymentByFra,
    listPaymentByDate,
	listByParameters,
	validatePaymentModel,
	uploadPaymentModel
};