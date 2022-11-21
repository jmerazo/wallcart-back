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


module.exports = {
    listRegimen,
    listDepartaments,
    listCities
}