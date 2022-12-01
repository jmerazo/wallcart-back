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

const validatePaymentModel = async (nit, cto, cta, fra, val_abo, result) => {
	//console.log('====== Model ======')
	//console.log('Nit: ', nit)
	//console.log('Contrato: ', cto)
	//console.log('Cuenta: ',cta)
	//console.log('Factura: ',fra)
	//console.log('Valor abonado: ', val_abo)
	return new Promise((resolve, reject) => {
		connection.query(`SELECT 
							nit, contrato, cuenta, fecha_cuenta, factura, valor_total_factura, valor_abonado, fecha_abono 
							FROM cartera 
							WHERE nit = '${nit}' 
							AND contrato = '${cto}' 
							AND cuenta = '${cta}' 
							AND factura = "${fra}" 
							AND valor_abonado = '${val_abo}' 
							`, (e, val) => {
								if(e){
									return reject(e)
								}
								resolve(val)
		})
		
	})
}

const uploadPaymentModel = async (dataUpload) => {
	return new Promise((resolve, reject) => {
		connection.query('INSERT INTO cartera SET ?', dataUpload, (e, val) => {
			if(e){
				return reject(e)
			}
			resolve(val)})
	})
}

const validatePayUpModel = async (nit, cto, cta, fra) => {
	return new Promise((resolve, reject) => { 
		connection.query(`SELECT 
							ca.nit, ca.contrato, ca.cuenta, cs.valor_cuenta, ca.factura, ca.valor_abonado, ca.fecha_abono, ca.glosa_aceptada, ca.fga, ca.saldo 
							FROM cartera AS ca
							INNER JOIN cuentas AS cs
							ON ca.nit = cs.nit 
							AND ca.contrato = cs.contrato
							AND ca.cuenta = cs.cuenta 
							WHERE ca.nit = '${nit}' 
							AND ca.contrato = '${cto}' 
							AND ca.cuenta = '${cta}' 
							AND ca.factura = "${fra}"
							ORDER BY ca.fecha_abono 
							ASC LIMIT 1 
							`, (e, val) => {
								if(e){
									return reject(e)
								}
								console.log('Validation beads: ',val)
								resolve(val)
		})
		
	})
}

const uploadBeadsModel = async (dataUpload) => {
	return new Promise((resolve, reject) => {
		connection.query('INSERT INTO cuentas SET ?', dataUpload, (e, val) => {
			if(e){
				return reject(e)
			}
			resolve(val)})
	})
}

const validateBeadUpModel = async (nit, cto, cta) => {
	console.log('Model sql: ',nit," - ",cto," - ",cta)
	return new Promise((resolve, reject) => { 
		connection.query(`SELECT 
							* 
							FROM cuentas
							WHERE nit= '${nit}' 
							AND contrato = '${cto}' 
							AND cuenta = '${cta}'
							`, (e, val) => {
								if(e){
									return reject(e)
								}
								console.log('Model data return: ', val)
								resolve(val)
		})
		
	})
}

const beadList = async (nit, cto, cta) => {
	//console.log('Bead search: ', cta)
	return new Promise((resolve, reject) => { 
		connection.query(`SELECT * FROM cuentas WHERE nit = '${nit}' AND contrato = '${cto}' AND cuenta = '${cta}'
							`, (e, val) => {
								if(e){
									return reject(e)
								}
								//console.log('Bead found: ', val)
								resolve(val)
		})
		
	})
}

module.exports = {
    listPayments,
    listPaymentByNit,
    listPaymentByFra,
    listPaymentByDate,
	listByParameters,
	validatePaymentModel,
	uploadPaymentModel,
	validatePayUpModel,
	beadList,
	validateBeadUpModel,
	uploadBeadsModel
};