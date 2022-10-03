const connection = require('../db/con_db');

//Add new user
const createUserAuthModel = async (userData, result) => {
	await connection.query('INSERT INTO auth SET ?', userData, (error, results) => {
		if(error){			
			return result(error, null);
		}else{
			console.log("User data model: ",results.insertId);
			return result(null, results.insertId);
		}
	});
}

//Update user
const updateUserAuthModel = async (id, userData, result) => {
	await connection.query(`UPDATE auth SET ? WHERE id = ${id}`, userData, (error, results) => {
		if(error){
			return result(error, null);
		}else{
			return result(null, results.id)
		}
	});
}

//Update Password
const updatePassAuthModel = async (id, userData, result) => {
	await connection.query(`UPDATE auth SET ? WHERE user_id = ${id}`, userData, (error, results) => {
		if(error){
			return result(error, null);
		}else{
			return result(null, results.id);
		}
	});
}

//Update status user
const updateStatusModel = async (id, status, result) => {
	console.log("User model: ", id)
	console.log("Status model: ", status.status)
	await connection.query(`UPDATE auth AS l INNER JOIN users AS u ON l.user_id = u.id SET l.status = ${status.status}, u.status = ${status.status} WHERE l.user_id = ${id}`, (error, results) => {
		if(error){
			return result(error, null);
		}else{
			return result(null, results.id);
		}
	})
}
 
//Delete user by Id
const deleteUserAuthModel = async (id, result) => {
	await connection.query(`DELETE FROM auth WHERE id = ${id}`, (error, results) =>{
		if(error){
			return result(error, null)
		}else{
			return result(null, results.id)
		}
	});			
}

const userAuthByEmail = async (email, result) => {
	console.log("Desde model: ", email);
	await connection.query(`SELECT id,email,password,rol_id,status FROM auth WHERE email = "${email}" ORDER BY ID DESC LIMIT 1`, (error, validate) =>{
		if(error){
			return result(error, null);
		}else{
			console.log("Rta model: ", validate);
			return result(validate, null);
		}
	});
}

module.exports = {
    createUserAuthModel,
    updateUserAuthModel,
    deleteUserAuthModel,
	userAuthByEmail,
	updatePassAuthModel,
	updateStatusModel
};