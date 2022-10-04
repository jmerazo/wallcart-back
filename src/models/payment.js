const connection = require('../db/con_db');

//List users all
const listPayments = async function(result) {
    await connection.query('SELECT * FROM abonosyotrasfras LIMIT 1000', (error, payments) => {
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

//List Payment by multiparameters
const listPaymentByParameters = async function(search, result) {
    await connection.query(`SELECT * FROM abonosyotrasfras WHERE nit LIKE '${search.date}' AND fecha_pago > '${search.fi}' AND fecha_pago < '${search.ff}`, (error, payments) => {
		if(error){
			return result(error, null);
		}else{
			return result(null, payments);
		}
	});
}

module.exports = {
    listPayments,
    listPaymentByNit,
    listPaymentByFra,
    listPaymentByDate,
    listPaymentByParameters
};