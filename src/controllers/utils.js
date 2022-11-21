const utilsModels = require('../models/utils')

const listRegimenController = (req, res) => {
    utilsModels.listRegimen((regimen, e) => {
        if(e){
            res.status(500).json({message: 'Error list regimen: ',e})
        }else{
            res.status(200).json(regimen)
        }
    })
}

const listDepartmentsController = (req, res) => {
    utilsModels.listDepartaments((departments, e) => {
        if(e){
            res.status(500).json({message: 'Error list departments: ',e})
        }else{
            res.status(200).json(departments)
        }
    })
}

const listCitiesController = (req, res) => {
    var code = req.params.code;
    utilsModels.listCities(code, (cities, e) => {
        if(e){
            res.status(500).json({message: 'Error list cities: ',e})
        }else{
            res.status(200).json(cities)
        }
    })
}

module.exports = {
    listRegimenController,
    listDepartmentsController,
    listCitiesController
}