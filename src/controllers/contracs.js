const { json } = require('body-parser');
const contracsModel = require('../models/contracs');
let convertDateHelper = require('../Helpers/convertDate');

const addContracsController = async (req, res) => {
    let { num_cto, nit, modalidad_cto, nivel_cto, fec_ini_cto, fec_fin_cto, valor_cto, cod_serv_cto } = req.body;
    console.log('Nit: ',req.body.nit)
    console.log('Nombre: ', req.body.nombre)
    console.log('Regimen: ',req.body.regimen)
    console.log('Celular: ', req.body.celular)
    console.log('Correo: ', req.body.correo)
    console.log('Dirección: ', req.body.direccion)
    console.log('Ciudad: ', req.body.ciudad)
    console.log('Departamento: ', req.body.departamento)

    let contracSearch = await contracsModel.listContracsByNitModel(nit)
    if(!contracSearch){
        fec_ini_cto_cv = null
        if(fec_ini_cto){
            let fec_ini_cto_cv = convertDateHelper(fec_ini_cto)
        }

        fec_fin_cto_cv = null
        if(fec_fin_cto){
            let fec_fin_cto_cv = convertDateHelper(fec_fin_cto)
        }

        const contracData = {
            num_cto : num_cto,
            nit : nit,
            modalidad_cto : modalidad_cto,
            nivel_cto : nivel_cto,
            fec_ini_cto : fec_ini_cto_cv,
            fec_fin_cto : fec_fin_cto_cv,
            valor_cto : valor_cto,
            cod_serv_cto : cod_serv_cto
        }

        contracsModel.createContracsModel(contracData, (add, e) => {
            if(e){console.log('Error: ', e); res.status(500).json({message:'Error: ', e})}
            res.status(200).json(add);
        })
        
    }
    return json({message: `Contract ${num_cto} already exits`})             
}

const updateContracsController = (req, res) => {
    let { num_cto, nit, modalidad_cto, nivel_cto, fec_ini_cto, fec_fin_cto, valor_cto, cod_serv_cto } = req.body;
    fec_ini_cto_cv = null
    if(fec_ini_cto){
        let fec_ini_cto_cv = convertDateHelper(fec_ini_cto)
    }

    fec_fin_cto_cv = null
    if(fec_fin_cto){
        let fec_fin_cto_cv = convertDateHelper(fec_fin_cto)
    }

    const contracData = {
        num_cto : num_cto,
        nit : nit,
        modalidad_cto : modalidad_cto,
        nivel_cto : nivel_cto,
        fec_ini_cto : fec_ini_cto_cv,
        fec_fin_cto : fec_fin_cto_cv,
        valor_cto : valor_cto,
        cod_serv_cto : cod_serv_cto
    }
    contracsModel.updateContracsModel(contracData, (add, e) => {
        if(e){console.log('Error: ', e); res.status(500).json({message:'Error: ', e})}
        res.status(200).json(add);
    })

}

const deleteContracsController = (req, res) => {
    var id = req.params.id;

    contracsModel.deleteContracsModel(id, (del, e) => {
        if(e){ res.status(500).json({message: 'Error: ', e})}
        res.status(200).json({message: `Busine ${id} delete: `, del})
    })

}

const listContracsAllController = async (req, res, next) => {
    await contracsModel.listContracsAllModel((dataContracs, e) => {
        if(e){
            res.status(500).json({message: 'Error list contracs: ',e})
        }
        res.status(200).json(dataContracs)
    })
}

const listContracsByNitController = (req, res) => {
    var nit = req.params.nit;
    contracsModel.listContracsByNitModel(nit, (contrac, e) => {
        if(e) { res.status(500).json({message: 'Error search contrac by nit: ',e})}
        res.status(200).json(contrac)
    })
}
module.exports = {
    addContracsController,
    updateContracsController,
    deleteContracsController,
    listContracsAllController,
    listContracsByNitController
}