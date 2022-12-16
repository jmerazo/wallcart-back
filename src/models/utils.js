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

const statePortfolio = async(nit, rta) => {
    await connection.query(`SELECT c.id, c.nit, bs.nombre, c.cuenta, c.fecha_factura, c.fec_rad_factura, c.factura, c.valor_abonado, c.glosa_inicial, c.glosa_aceptada, ca.saldo_s 
                            FROM cartera c
                            INNER JOIN ( SELECT s.cuenta cuenta_s, s.saldo saldo_s, s.contrato contrato_s, s.nit nit_s FROM cartera s ORDER BY s.id DESC) ca ON ca.nit_s = c.nit AND ca.cuenta_s = c.cuenta and ca.contrato_s = c.contrato
                            INNER JOIN business bs ON ca.nit_s = bs.nit 
                            WHERE c.nit = '${nit}' AND ca.saldo_s <> 0
                            GROUP BY ca.cuenta_s, ca.nit_s`, (data, e) => {
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