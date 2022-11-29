const connection = require('../db/con_db');

//List debtor companies
const debtorCompanies = async function(result) {
    await connection.query('SELECT b.nombre, c.saldo FROM cartera AS c INNER JOIN business AS b ON b.nit = c.nit ORDER BY b.nombre DESC LIMIT 5', (error, debtor) => {
		if(error){
			return result(error, null);
		}else{
			return result(null, debtor);
		}
	});
}

module.exports = {
    debtorCompanies
}