const { json } = require('body-parser');
const businessModel = require('../models/business');

const addBusinessController = async (req, res) => {
    var { nit, nombre, regimen, celular, correo, direccion, ciudad, departamento } = req.body;
    console.log('Nit: ',req.body.nit)
    console.log('Nombre: ', req.body.nombre)
    console.log('Regimen: ',req.body.regimen)
    console.log('Celular: ', req.body.celular)
    console.log('Correo: ', req.body.correo)
    console.log('Dirección: ', req.body.direccion)
    console.log('Ciudad: ', req.body.ciudad)
    console.log('Departamento: ', req.body.departamento)

    businessModel.listBusinessByIdModel(nit)
    .then((search) => {
        console.log('Search: ',search)
        if(search.length == 0){
            const businessData = {
                nit : nit,
                nombre : nombre,
                cod_reg : regimen,
                celular : celular,
                correo : correo,
                direccion : direccion,
                ciudad : ciudad,
                departamento : departamento
            }
    
            console.log(businessData)
            businessModel.createBusinessModel(businessData, (add, e) => {
                if(e){console.log('Error: ', e); res.status(500).json({message:'Error: ', e})}
                res.status(200).json(add);
            })
            
        }else{
            return json({message: 'Already exits'})            
        }        
    })
    .catch((e) => {
        console.log(e)
    })
}

const updateBusinessController = (req, res) => {
    var { nit, nombre, regimen, celular, correo, direccion, ciudad, departamento } = req.body;
    const businessData = {
        nit : nit,
        nombre : nombre,
        cod_reg : regimen,
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

const listBusinessAllController = async (req, res, next) => {
    await businessModel.listBusinessAllModel((dataBusiness, e) => {
        if(e){
            res.status(500).json({message: 'Error list business: ',e})
        }else{
            console.log('Business list controller: ',dataBusiness)
            res.status(200).json(dataBusiness)
        }
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