const connection = require('../db/con_db');

// Age 1 - 30 days
const agesMonthList = async function(result) {
    await connection.query('SELECT a.nit, e.nombre, e.cod_reg, r.nom_reg, COALESCE(SUM(CASE WHEN fecha_envio < DATE(now()) AND fecha_envio > DATE(DATE_ADD(NOW(), INTERVAL - MONTH)) then valor_factura end),0) edad2 FROM consolidado as a INNER JOIN empresa AS e ON a.nit = e.nit INNER JOIN regimen as r ON r.cod_reg = e.cod_reg GROUP BY a.nit order by r.nom_reg;', (error, payments) => {
		if(error){
			return result(error, null);
		}else{
			return result(null, payments);
		}
	});
}

// Age 31 - 60 days
const ages2MonthList = async function(result) {
    await connection.query('SELECT a.nit, e.nombre, e.cod_reg, r.nom_reg, COALESCE(SUM(CASE WHEN fecha_envio < DATE(DATE_ADD(NOW(), INTERVAL -1 MONTH)) AND fecha_envio > DATE(DATE_ADD(NOW(), INTERVAL -2 MONTH)) then valor_factura end),0) edad2 FROM consolidado as a INNER JOIN empresa AS e ON a.nit = e.nit INNER JOIN regimen as r ON r.cod_reg = e.cod_reg GROUP BY a.nit order by r.nom_reg', (error, payments) => {
		if(error){
			return result(error, null);
		}else{
			return result(null, payments);
		}
	});
}

// Age 61 - 90 days
const ages3MonthList = async function(result) {
    await connection.query('SELECT a.nit, e.nombre, e.cod_reg, r.nom_reg, COALESCE(SUM(CASE WHEN fecha_envio < DATE(DATE_ADD(NOW(), INTERVAL -2 MONTH)) AND fecha_envio > DATE(DATE_ADD(NOW(), INTERVAL -3 MONTH)) then valor_factura end),0) edad2 FROM consolidado as a INNER JOIN empresa AS e ON a.nit = e.nit INNER JOIN regimen as r ON r.cod_reg = e.cod_reg GROUP BY a.nit order by r.nom_reg', (error, payments) => {
		if(error){
			return result(error, null);
		}else{
			return result(null, payments);
		}
	});
}

// Age 91 - 180 days
const ages4MonthList = async function(result) {
    await connection.query('SELECT a.nit, e.nombre, e.cod_reg, r.nom_reg, COALESCE(SUM(CASE WHEN fecha_envio < DATE(DATE_ADD(NOW(), INTERVAL -4 MONTH)) AND fecha_envio > DATE(DATE_ADD(NOW(), INTERVAL -6 MONTH)) then valor_factura end),0) edad2 FROM consolidado as a INNER JOIN empresa AS e ON a.nit = e.nit INNER JOIN regimen as r ON r.cod_reg = e.cod_reg GROUP BY a.nit order by r.nom_reg', (error, payments) => {
		if(error){
			return result(error, null);
		}else{
			return result(null, payments);
		}
	});
}

// Age 181 - 360 days
const ages6a12MonthList = async function(result) {
    await connection.query('SELECT a.nit, e.nombre, e.cod_reg, r.nom_reg, COALESCE(SUM(CASE WHEN fecha_envio < DATE(DATE_ADD(NOW(), INTERVAL -6 MONTH)) AND fecha_envio > DATE(DATE_ADD(NOW(), INTERVAL -12 MONTH)) then valor_factura end),0) edad2 FROM consolidado as a INNER JOIN empresa AS e ON a.nit = e.nit INNER JOIN regimen as r ON r.cod_reg = e.cod_reg GROUP BY a.nit order by r.nom_reg', (error, payments) => {
		if(error){
			return result(error, null);
		}else{
			return result(null, payments);
		}
	});
}

// Age > 360 days
const ages12MonthList = async function(result) {
    await connection.query('SELECT a.nit, e.nombre, e.cod_reg, r.nom_reg, COALESCE(SUM(CASE WHEN fecha_envio < DATE(DATE_ADD(NOW(), INTERVAL -12 MONTH)) then valor_factura end),0) edad2 FROM consolidado as a INNER JOIN empresa AS e ON a.nit = e.nit INNER JOIN regimen as r ON r.cod_reg = e.cod_reg GROUP BY a.nit order by r.nom_reg', (error, payments) => {
		if(error){
			return result(error, null);
		}else{
			return result(null, payments);
		}
	});
}

// PARA REPORTE DE EDADES SE USA FECHA RADICACION FACTURA
// PARA REPORTE VIGENCIAS SE USA FECHA DE FACTURA

// Age report
const agesList = async (date, result) => {
    await connection.query(`SELECT 
							c.id, c.nit, e.nombre, e.cod_reg, r.nom_reg,
							COALESCE(SUM(CASE WHEN DATEDIFF('${date}', c.fecha_envio) = 0 THEN c.valor_factura END),0) edad0, 
							COALESCE(SUM(CASE WHEN DATEDIFF('${date}', c.fecha_envio) < 31 THEN c.valor_factura END),0) edad1,
							COALESCE(SUM(CASE WHEN DATEDIFF('${date}', c.fecha_envio) > 30 AND DATEDIFF('${date}', c.fecha_envio) < 61 THEN c.valor_factura END),0) edad2, 
							COALESCE(SUM(CASE WHEN DATEDIFF('${date}', c.fecha_envio) > 60 AND DATEDIFF('${date}', c.fecha_envio) < 91 THEN c.valor_factura END),0) edad3, 
							COALESCE(SUM(CASE WHEN DATEDIFF('${date}', c.fecha_envio) > 90 AND DATEDIFF('${date}', c.fecha_envio) < 181 THEN c.valor_factura END),0) edad4, 
							COALESCE(SUM(CASE WHEN DATEDIFF('${date}', c.fecha_envio) > 180 AND DATEDIFF('${date}', c.fecha_envio) < 361 THEN c.valor_factura END),0) edad5, 
							COALESCE(SUM(CASE WHEN DATEDIFF('${date}', c.fecha_envio) > 360 THEN c.valor_factura END),0) edad6 
							FROM consolidado AS c 
							INNER JOIN empresa AS e ON c.nit = e.nit 
							INNER JOIN regimen AS r ON r.cod_reg = e.cod_reg
							GROUP BY c.nit 
							ORDER BY r.nom_reg`, 
							(error, ages) => {
        if(error){
            return result(error)
        }else{
            return result(ages)
        }
    })
}

// Ages new report
const agesNewListModel = async (date, result) => {
    await connection.query(`SELECT 
							c.nit, e.nombre, e.cod_reg, r.nom_reg, 
							COALESCE(SUM(CASE WHEN DATEDIFF('${date}', c.fec_rad_factura) < 1 THEN c.saldo END),0) edad0, 
							COALESCE(SUM(CASE WHEN DATEDIFF('${date}', c.fec_rad_factura) < 31 THEN c.saldo END),0) edad1,
							COALESCE(SUM(CASE WHEN DATEDIFF('${date}', c.fec_rad_factura) > 30 AND DATEDIFF('${date}', c.fec_rad_factura) < 61 THEN c.saldo END),0) edad2, 
							COALESCE(SUM(CASE WHEN DATEDIFF('${date}', c.fec_rad_factura) > 60 AND DATEDIFF('${date}', c.fec_rad_factura) < 91 THEN c.saldo END),0) edad3, 
							COALESCE(SUM(CASE WHEN DATEDIFF('${date}', c.fec_rad_factura) > 90 AND DATEDIFF('${date}', c.fec_rad_factura) < 181 THEN c.saldo END),0) edad4, 
							COALESCE(SUM(CASE WHEN DATEDIFF('${date}', c.fec_rad_factura) > 180 AND DATEDIFF('${date}', c.fec_rad_factura) < 361 THEN c.saldo END),0) edad5, 
							COALESCE(SUM(CASE WHEN DATEDIFF('${date}', c.fec_rad_factura) > 360 THEN c.saldo END),0) edad6 
							FROM cartera AS c 
							INNER JOIN empresa AS e ON c.nit = e.nit 
							INNER JOIN regimen AS r ON r.cod_reg = e.cod_reg
							GROUP BY c.nit 
							ORDER BY r.nom_reg`, 
							(error, ages) => {
        if(error){
            return result(error)
        }else{
            return result(ages)
        }
    })
}

// Ages new report
const agesListModel = async (date, result) => {
    await connection.query(`SELECT 
							c.id, c.nit, e.nombre, e.cod_reg, r.nom_reg, 
							COALESCE(SUM(CASE WHEN DATEDIFF('${date}', DATE(DATE_ADD(NOW(), INTERVAL -1 YEAR)) THEN c.valor_factura END),0) A2022, 
							COALESCE(SUM(CASE WHEN DATEDIFF(DATE(DATE_ADD(NOW(), INTERVAL -1 YEAR), DATE(DATE_ADD(NOW(), INTERVAL -2 YEAR)) THEN c.valor_factura END),0) A2021,
							COALESCE(SUM(CASE WHEN DATEDIFF(DATE(DATE_ADD(NOW(), INTERVAL -2 YEAR), DATE(DATE_ADD(NOW(), INTERVAL -3 YEAR)) THEN c.valor_factura END),0) A2020, 
							COALESCE(SUM(CASE WHEN DATEDIFF(DATE(DATE_ADD(NOW(), INTERVAL -3 YEAR), DATE(DATE_ADD(NOW(), INTERVAL -4 YEAR)) THEN c.valor_factura END),0) A2019, 
							COALESCE(SUM(CASE WHEN DATEDIFF(DATE(DATE_ADD(NOW(), INTERVAL -4 YEAR), DATE(DATE_ADD(NOW(), INTERVAL -5 YEAR)) THEN c.valor_factura END),0) A2018, 
							COALESCE(SUM(CASE WHEN DATEDIFF('${date}', c.fecha_envio) > 180 AND DATEDIFF('${date}', c.fecha_envio) < 361 THEN c.valor_factura END),0) edad5, 
							COALESCE(SUM(CASE WHEN DATEDIFF('${date}', c.fecha_envio) > 360 THEN c.valor_factura END),0) edad6 
							FROM cartera AS c 
							INNER JOIN empresa AS e ON c.nit = e.nit 
							INNER JOIN regimen AS r ON r.cod_reg = e.cod_reg
							GROUP BY c.nit 
							ORDER BY r.nom_reg`, 
							(error, ages) => {
        if(error){
            return result(error)
        }else{
            return result(ages)
        }
    })
}

const validityAgesModel = async (year) => {
	return new Promise((resolve, reject) => {
		connection.query(`SELECT 
					c.nit, 
					e.nombre, 
					e.cod_reg, 
					r.nom_reg,
					c.periodo_anio AS vigencia, 
					SUM(valor_factura) AS valor 
					FROM consolidadoc AS c 
					INNER JOIN empresa AS e ON e.nit = c.nit 
					INNER JOIN regimen AS r ON r.cod_reg = e.cod_reg 
					WHERE c.periodo_anio = ${year} 
					GROUP BY c.nit 
					ORDER BY r.nom_reg`, (e, val) => {
						if(e){
							return reject(e)
						}
						resolve(val)
					})

	})
}

const validityAgesNewModel = async (dateInit,dateEnd) => {
	console.log(dateInit," - ",dateEnd)
	return new Promise((resolve, reject) => {
		connection.query(`SELECT 
						c.nit, 
						e.nombre, 
						e.cod_reg, 
						r.nom_reg, 
						c.fecha_factura AS vigencia, 
						SUM(c.saldo) AS valor 
						FROM cartera AS c 
						INNER JOIN empresa AS e ON e.nit = c.nit 
						INNER JOIN regimen AS r ON r.cod_reg = e.cod_reg
						WHERE YEAR(c.fecha_factura) BETWEEN YEAR('${dateInit}') AND YEAR('${dateEnd}') 
						GROUP BY YEAR(c.fecha_factura), c.nit
						ORDER BY r.nom_reg, c.nit, YEAR(c.fecha_factura)
						`, (e, val) => {
							if(e){
								return reject(e)
							}
							console.log('Validity new:', val)
							resolve(val)
						})
	})
}

/* SELECT 
						c.nit, 
						e.nombre, 
						e.cod_reg, 
						r.nom_reg, 
						c.fecha_factura AS vigencia, 
						SUM(c.saldo) AS valor 
						FROM cartera AS c 
						INNER JOIN empresa AS e ON e.nit = c.nit 
						INNER JOIN regimen AS r ON r.cod_reg = e.cod_reg
						WHERE YEAR(c.fecha_factura) BETWEEN '2022' AND '2022' 
						GROUP BY YEAR(c.fecha_factura), c.nit
						ORDER BY r.nom_reg,c.nit;*/

module.exports = {
    agesMonthList,
    ages2MonthList,
    ages3MonthList,
    ages4MonthList,
    ages6a12MonthList,
    ages12MonthList,
    agesList,
	validityAgesModel,
	validityAgesNewModel,
	agesNewListModel
};