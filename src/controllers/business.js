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


module.exports = {
    addBusinessController
}