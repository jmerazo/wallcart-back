const utilsModels = require('../models/utils')
const exportFileHelper = require('../Helpers/exportFile');
const path = require('path');

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

const statePortfolioController = async (req, res) => {
    const nit = req.params.nit;
    utilsModels.statePortfolio(nit, (state, e) => {
        if(e){
            res.status(500).json({ message: 'Error list state: ',e})
        }else{
            res.status(200).json(state)
        }
    })
}

const exportState = async (req, res) => {
    let data = req.body;
    let nameFileDownload = await exportFileHelper.exportFileState(data);
    let fileBase = path.join(__dirname, '..', '..', nameFileDownload);
    return res.status(200).download(fileBase, (e) => {
        if(e){
            console.log('Error to download file: ',e)
        }else{
            console.log('Download successfully')
        }
    });
}

module.exports = {
    listRegimenController,
    listDepartmentsController,
    listCitiesController,
    statePortfolioController,
    exportState
}