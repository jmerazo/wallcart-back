const connection = require('../db/con_db');

//Add new business
const createContracsModel = (contracsData) => {
    return new Promise((resolve, reject) => {
		connection.query('INSERT INTO contratos SET ?', contracsData, (e, success) => {
			if(e){ return reject(e) }
			resolve(success)
        })
	})
}

//Update business
const updateContracsModel = (id, contracsData) => {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE contratos SET ? WHERE id = ${id}`, contracsData, (e, success) => {
            if(e){return reject(e)}
			resolve(success)
        });
    })
}
 
//Delete business by Id
const deleteContracsModel = (id) => {
    return new Promise((resolve, reject) => {
        connection.query(`DELETE FROM contratos WHERE id = ${id}`, (e, success) =>{
            if(e){return reject(e)}
			resolve(success)
        });
    })			
}

// List all business
const listContracsAllModel = async (result) =>{
    await connection.query(`SELECT
                            c.id, 
                            c.num_cto, 
                            c.nit, 
                            b.nombre, 
                            c.modalidad_cto, 
                            c.nivel_cto, 
                            c.fec_ini_cto, 
                            c.fec_fin_cto, 
                            c.valor_cto, 
                            cod_serv_cto 
                            FROM contratos AS c 
                            INNER JOIN business AS b 
                            ON c.nit = b.nit`, (e, contracs) => {
        if(e){return result('Status 500, not create',e)}
        return result(contracs)
    })
}

// List business by id
const listContracsByNitModel =  (nit) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM contratos WHERE nit = ${nit}`, (e, contrac) => {
            if(e){ reject(e) } 
            resolve(contrac)
        })
    })
}

// List contracs like
const listContracsLike = (filter, params, result) => {
    connection.query(`SELECT * FROM contratos WHERE ${filter} LIKE '%${params}%'`, (e, contracs) => {
        if(e){ return result(e) }
        return result(contracs)
    })
}

module.exports = {
    createContracsModel,
    updateContracsModel,
    deleteContracsModel,
	listContracsByNitModel,
    listContracsAllModel,
    listContracsLike
};