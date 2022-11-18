const { json } = require('body-parser');
const businessModel = require('../models/business');

const addBusinessController = async (req, res) => {
    var { nit, nombre, cod_reg, celular, correo, direccion, ciudad, departamento } = req.body;

    businessModel.listBusinessByIdModel(nit)
    .then((search) => {
        if(search.lenght != 0){
            return json({message: 'Already exits'})
        }
        
        const businessData = {
            nit : nit,
            nombre : nombre,
            cod_reg : cod_reg,
            celular : celular,
            correo : correo,
            direccion : direccion,
            ciudad : ciudad,
            departamento : departamento
        }
        businessModel.createBusinessModel(businessData, (add, e) => {
            if(e){console.log('Error: ', e); res.status(500).json({message:'Error: ', e})}
            res.status(200).json(add);
        })
    })
    .catch((e) => {
        console.log(e)
    })
}

const updateBusinessController = (req, res) => {
    var { nit, nombre, cod_reg, celular, correo, direccion, ciudad, departamento } = req.body;
    const businessData = {
        nit : nit,
        nombre : nombre,
        cod_reg : cod_reg,
        celular : celular,
        correo : correo,
        direccion : direccion,
        ciudad : ciudad,
        departamento : departamento
    }
    businessModel.updateBusinessModel(businessData, (add, e) => {
        if(e){console.log('Error: ', e); res.status(500).json({message:'Error: ', e})}
        res.status(200).json(add);
    })

}

const deleteBusinessController = (req, res) => {
    var id = req.params.id;

    businessModel.deleteBusinessModel(id, (del, e) => {
        if(e){ res.status(500).json({message: 'Error: ', e})}
        res.status(200).json({message: 'Busine delete: ', del})
    })

}

const listBusinessAllController = (res) => {
    businessModel.listBusinessAllModel((business, e) => {
        if(e){ res.status(500).json({message: 'Error list all: ', e})}
        res.status(200).json(business)
    })
}

const listBusinessByNitController = (req, res) => {
    var nit = req.params.nit;
    businessModel.listBusinessByIdModel(nit, (busine, e) => {
        if(e) { res.status(500).json({message: 'Error search business by nit: ',e})}
        res.status(200).json(busine)
    })
}
module.exports = {
    addBusinessController,
    updateBusinessController,
    deleteBusinessController,
    listBusinessAllController,
    listBusinessByNitController
}