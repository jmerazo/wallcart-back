const connection = require('../db/con_db')

const listRegimen = async (result) => {
    await connection.query(`SELECT * FROM regimen`, (regimen, e) => {
        if(e){
            console.log('List regimen error: ',e)
            return result(e)
        }else{
            return result(regimen);
        }
    })
}

const listDepartaments = async(result) => {
    await connection.query(`SELECT * FROM departments`, (departments, e) => {
        if(e){
            console.log('Error list departments: ',e)
            return result(e)
        }else{
            return result(departments)
        }
    })
}

const listCities = async(code, result) => {
    await connection.query(`SELECT * FROM cities WHERE department_id = ${code}`, (cities, e) => {
        if(e){
            console.log('Error list departments: ',e)
            return result(e)
        }else{
            return result(cities)
        }
    })
}

const statePortfolio = async(df, di, rta) => {
    await connection.query(`SELECT 
                            id, nit, cuenta, fecha_factura, fec_rad_factura, factura, valor_abonado, glosa_inicial, glosa_aceptada, saldo 
                            FROM cartera 
                            WHERE nit = '800130907-4' 
                            AND fec_rad_factura <= '2022-11-30' 
                            AND fec_rad_factura >= DATE_ADD('2022-11-30', INTERVAL -1 YEAR) 
                            AND saldo > 0 
                            GROUP BY cuenta,contrato 
                            ORDER BY id ASC`, (data, e) => {
                                if(e){
                                    return rta(e)
                                }else{
                                    return rta(data)
                                }
                            })
}

/* SELECT id, nit, cuenta, fecha_factura, fec_rad_factura, factura, valor_abonado, glosa_inicial, glosa_aceptada, saldo FROM cartera WHERE nit = '800130907-4' AND saldo > 0 AND MAX(updated) GROUP BY cuenta,contrato ORDER BY id DESC;
*/

module.exports = {
    listRegimen,
    listDepartaments,
    listCities,
    statePortfolio
}