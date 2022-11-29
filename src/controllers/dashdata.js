const dashModel = require('../models/dashdata');

const listDashDataController = async (req, res, next) => {
    await dashModel.debtorCompanies((err, data) => {
        res.status(200).json(data);
    });    
}

module.exports = {
    listDashDataController
}