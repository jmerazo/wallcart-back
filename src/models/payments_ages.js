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
    await connection.query(`SELECT a.nit, e.nombre, e.cod_reg, r.nom_reg, COALESCE(SUM(CASE WHEN DATEDIFF('${date}', fecha_envio) < 1 THEN valor_factura END),0) edad0, COALESCE(SUM(CASE WHEN DATEDIFF('${date}', fecha_envio) < 31 THEN valor_factura END),0) edad1, COALESCE(SUM(CASE WHEN DATEDIFF('${date}', fecha_envio) > 30 AND DATEDIFF('${date}', fecha_envio) < 61 THEN valor_factura END),0) edad2, COALESCE(SUM(CASE WHEN DATEDIFF('${date}', fecha_envio) > 60 AND DATEDIFF('${date}', fecha_envio) < 91 THEN valor_factura END),0) edad3, COALESCE(SUM(CASE WHEN DATEDIFF('${date}', fecha_envio) > 90 AND DATEDIFF('${date}', fecha_envio) < 181 THEN valor_factura END),0) edad4, COALESCE(SUM(CASE WHEN DATEDIFF('${date}', fecha_envio) > 180 AND DATEDIFF('${date}', fecha_envio) < 361 THEN valor_factura END),0) edad5, COALESCE(SUM(CASE WHEN DATEDIFF('${date}', fecha_envio) > 360 THEN valor_factura END),0) edad6 FROM consolidado AS a INNER JOIN empresa AS e ON a.nit = e.nit INNER JOIN regimen AS r ON r.cod_reg = e.cod_reg GROUP BY a.nit ORDER BY r.nom_reg`, (error, ages) => {
        if(error){
            return result(error)
        }else{
            return result(ages)
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
    agesList    
};