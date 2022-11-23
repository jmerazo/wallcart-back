const { json } = require('body-parser');
const contracsModel = require('../models/contracs');
let convertDateHelper = require('../Helpers/convertDate');
let businessModel = require('../models/business');

const addContracsController = async (req, res) => {
    let { num_cto, nit, modalidad_cto, nivel_cto, fec_ini_cto, fec_fin_cto, valor_cto, cod_serv_cto } = req.body;
    console.log('Contrato: ',req.body.num_cto)
    console.log('Nit: ', req.body.nit)
    console.log('Modalidad: ',req.body.modalidad_cto)
    console.log('Nivel: ', req.body.nivel_cto)
    console.log('Fecha inicio: ', req.body.fec_ini_cto)
    console.log('Fecha Fin: ', req.body.fec_fin_cto)
    console.log('Valor: ', req.body.valor_cto)
    console.log('Codigo: ', req.body.cod_serv_cto)

    let contracSearch = await contracsModel.listContracsByCtoModel(num_cto, nit);
    console.log('Validate contrac: ',contracSearch)
    let businesSearch = await businessModel.listBusinessByIdModel(nit);
    console.log('Validate business: ',businesSearch)
    if(contracSearch.length == 0 && businesSearch.length != 0){
        const contracData = {
            num_cto : num_cto,
            nit : nit,
            modalidad_cto : modalidad_cto,
            nivel_cto : nivel_cto,
            fec_ini_cto : fec_ini_cto,
            fec_fin_cto : fec_fin_cto,
            valor_cto : valor_cto,
            cod_serv_cto : cod_serv_cto
        }
        console.log('Data contracs: ', contracData)

        contracsModel.createContracsModel(contracData, (add, e) => {
            if(e){console.log('Error: ', e); res.status(500).json({message:'Error: ', e})}
            res.status(200).json(add);
        })
        res.status(200).json(contracData);        
    }else{
        return res.status(200).json({message: `Contract ${num_cto} already exits`}) 
    }              
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

const listContracsLikeController = (req, res) => {
    var filter = req.params.filter;
    var params = req.params.params;
    contracsModel.listContracsLike(filter, params, (contracs, e) => {
        if(e) { res.status(500).json({message: 'Error search business by nit: ',e})}
        res.status(200).json(contracs)
    })
}

module.exports = {
    addContracsController,
    updateContracsController,
    deleteContracsController,
    listContracsAllController,
    listContracsByNitController,
    listContracsLikeController
}