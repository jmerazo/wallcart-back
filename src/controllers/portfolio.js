const portModel = require('../models/portfolio');

const listPortfolioController = async (req, res, next) => {
    await portModel.listPortfolioModel((err, data) => {res.status(200).json(data)});    
}

const listPortfolioByNitController = async (req, res, next) => {
    const nit = req.params.nit;
    await portModel.listPortfolioByNitModel(nit, (err, data) => {
        if(err){res.status(500).json({message:'Error: ', err})}
        else{res.status(200).json(data)}
    });
}

const listPortfolioByFraController = async (req, res, next) => {
    const fra = req.params.fra;
    await portModel.listPortfolioByFraModel(fra, (err, data) => {
        if(err){res.status(500).json({message:'Error: ', err})}
        else{res.status(200).json(data)}
    });
}

const listPortfolioByDateController = async (req, res, next) => {
    const date = req.params.date;
    await portModel.listPortfolioByDateModel(date, (err, data) => {
        if(err){res.status(500).json({message:'Error'})}
        else{res.status(200).json(data)}
    });
}

const listPortfolioByParametersController = async (req, res, next) => {
    const nit = req.params.nit;
    const fi = req.params.date_init;
    const ff = req.params.date_end;

    await portModel.listPortfolioByParameters(nit, fi, ff, (err, data) => {
        if(err){res.status(500).json({message:'Error'})}
        else{res.status(200).json(data)}
    });
}

const listParametersController = async (req, res, next) => {
    const col = req.params.col;
    const param = req.params.param;

    await portModel.listByParametersModel(col, param, (err, data) => {
        if(err){res.status(500).json({message:'Error', err})}
        else{res.status(200).json(data)}
    });
}

const listConsolidatedController = async (req, res, next) => {
    await portModel.listConsolidatedModel((err, data) => {res.status(200).json(data)});    
}

const listAgesPortfolioController = async (req, res, next) => {
    var date = req.params.date
    await portModel.listAgesPortfolioModel(date, (data, error) => {
        if(error){res.status(500).json({message:'Error', error})}
        else{res.status(200).json(data)}
    })
}


module.exports = {
    listPortfolioController,
    listPortfolioByNitController,
    listPortfolioByFraController,
    listPortfolioByDateController,
    listPortfolioByParametersController,
    listAgesPortfolioController,
    listParametersController,
    listConsolidatedController
}