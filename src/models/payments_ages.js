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

// Age report
const agesList = async (date, result) => {
    await connection.query(`SELECT 
							c.id, c.nit, e.nombre, e.cod_reg, r.nom_reg, 
							COALESCE(SUM(CASE WHEN DATEDIFF('${date}', c.fecha_envio) < 1 THEN c.valor_factura END),0) edad0, 
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

// Age report
const validityList = async (date, result) => {
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

var val = []
const validityAges = async (year, r) => {
	//console.log("Year model: ", year);
	await connection.query(`SELECT 
							c.nit, 
							e.nombre, 
							e.cod_reg, 
							r.nom_reg, 
							SUM(valor_factura) AS A${year} 
							FROM consolidadoc AS c 
							INNER JOIN empresa AS e ON e.nit = c.nit 
							INNER JOIN regimen AS r ON r.cod_reg = e.cod_reg 
							WHERE c.periodo_anio = ${year} 
							GROUP BY c.nit 
							ORDER BY r.nom_reg`,
							(e, val) => {
								if(e){
									return r('Error sql: ',e)
								}else{
									//console.log("Val: ", val)
									return r(val)
								}
							})
}

module.exports = {
    agesMonthList,
    ages2MonthList,
    ages3MonthList,
    ages4MonthList,
    ages6a12MonthList,
    ages12MonthList,
    agesList,
	validityAges    
};