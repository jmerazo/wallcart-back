const connection = require('../db/con_db');

//Add new business
const createBusinessModel = (businessData) => {
    return new Promise((resolve, reject) => {
		connection.query('INSERT INTO business SET ?', businessData, (e, success) => {
			if(e){ return reject(e) }
			resolve(success)
        })
	})
}

//Update business
const updateBusinessModel = (nit, businessData) => {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE business SET ? WHERE nit = ${nit}`, businessData, (e, success) => {
            if(e){return reject(e)}
			resolve(success)
        });
    })
}
 
//Delete business by Id
const deleteBusinessModel = (id) => {
    return new Promise((resolve, reject) => {
        connection.query(`DELETE FROM business WHERE id = ${id}`, (e, success) =>{
            if(e){return reject(e)}
			resolve(success)
        });
    })			
}

// List all business
const listBusinessAllModel = async (result) =>{
    await connection.query(`SELECT * FROM business`, (e, business) => {
        if(e){return result('Status 500, not create',e)}
        console.log('Business model: ',business)
        return result(business)
    })
}

// List business by id
const listBusinessByIdModel =  (nit) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM business WHERE nit = ${nit}`, (e, busine) => {
            if(e){ reject(e) } 
            resolve(busine)
        })
    })
}

// List business like
const listBusinessLikeByName = (filter, params, result) => {
    connection.query(`SELECT * FROM business WHERE ${filter} LIKE '%${params}%'`, (e, busines) => {
        if(e){ return result(e) }
        return result(busines)
    })
}

module.exports = {
    createBusinessModel,
    updateBusinessModel,
    deleteBusinessModel,
	listBusinessByIdModel,
    listBusinessAllModel,
    listBusinessLikeByName
};