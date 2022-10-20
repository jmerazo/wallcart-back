const connection = require('../db/con_db');

//List portfolio all
const listPortfolioModel = async (r) => {
    await connection.query(`SELECT * 
                            FROM cartera 
                            ORDER BY fecha_factura desc 
                            LIMIT 200 
                            OFFSET 200`, 
        (error, portfolio) => {
            if(error){return r(error, null)}
            else{return r(null, portfolio)}
	});
}

//List Portfolio by Nit
const listPortfolioByNitModel = async (nit, r) => {
    await connection.query(`SELECT * 
                            FROM cartera 
                            WHERE nit 
                            LIKE '%${nit}%'`, 
        (error, payments) => {
            if(error){return r(error, null)}
            else{return r(null, payments)}
	});
}

//List Portfolio by Sale
const listPortfolioByFraModel = async (fra, r) => {
    await connection.query(`SELECT * 
                            FROM cartera 
                            WHERE factura = ${fra}`, 
        (error, payments) => {
            if(error){return r(error, null)}
            else{return r(null, payments)}
	});
}

//List Portfolio by Sale
const listPortfolioByDateModel = async (date, r) => {
    await connection.query(`SELECT * 
                            FROM cartera 
                            WHERE fecha_factura = "${date}"`, 
        (error, payments) => {
            if(error){return r(error, null)}
            else{return r(null, payments)}
	});
}

const listPortfolioByParameters = async (nit, fi, ff, r) => {
	await connection.query(`SELECT * 
                            FROM cartera 
                            WHERE nit 
                            LIKE ${nit} 
                            AND fecha_factura > '${fi}' 
                            AND fecha_factura < '${ff}'`, 
        (error, payments) => {
            if(error){return r(error, null)}
            else{return r(null, payments)}
	})
}

const listByParametersModel = async (col, param, r) => {
    console.log('Col model: ', col)
    console.log('Param model: ', param)
	await connection.query(`SELECT * 
                            FROM cartera 
                            WHERE ${col} = '${param}'`, 
        (error, payments) => {
            if(error){return r(error, null)}
            else{return r(null, payments)}
	})
}

// Age report
const listAgesPortfolioModel = async (date, result) => {
    await connection.query(`SELECT 
							c.nit, e.nombre, e.cod_reg, r.nom_reg, 
							COALESCE(SUM(CASE WHEN DATEDIFF('${date}', c.fecha_envio) < 1 THEN c.valor_factura END),0) edad0, 
							COALESCE(SUM(CASE WHEN DATEDIFF('${date}', c.fecha_envio) < 31 THEN c.valor_factura END),0) edad1,
							COALESCE(SUM(CASE WHEN DATEDIFF('${date}', c.fecha_envio) > 30 AND DATEDIFF('${date}', c.fecha_envio) < 61 THEN c.valor_factura END),0) edad2, 
							COALESCE(SUM(CASE WHEN DATEDIFF('${date}', c.fecha_envio) > 60 AND DATEDIFF('${date}', c.fecha_envio) < 91 THEN c.valor_factura END),0) edad3, 
							COALESCE(SUM(CASE WHEN DATEDIFF('${date}', c.fecha_envio) > 90 AND DATEDIFF('${date}', c.fecha_envio) < 181 THEN c.valor_factura END),0) edad4, 
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

module.exports = {
    listPortfolioModel,
    listPortfolioByNitModel,
    listPortfolioByFraModel,
    listPortfolioByDateModel,
    listPortfolioByParameters,
    listByParametersModel,
    listAgesPortfolioModel
}
