const fs = require('fs');
const carbone = require('carbone');
const path = require('path');

let filePathFormat = path.join(__dirname + '/resources/format_validity.ods')
// Generate a report using the sample template provided by carbone module
// This LibreOffice template contains "Hello {d.firstname} {d.lastname} !"
// Of course, you can create your own templates!

async function exportFile(dataExport){
    //console.log('Data export file: ',data[0].nit)
    //console.log('Data export file: ',data[0].nom_reg)
    //console.log('Data export file: ',data[0].nombre)
    //console.log('Data export file: ',data[0].edad0)

    let dataJSON = JSON.stringify(dataExport);
    const data = await dataExport.reduce((acc, item) => {
        acc[item.nombre] = item
        return acc
      }, {})
    console.log('Data JSON: ',data)
    let fileWrite = await carbone.render(filePathFormat, data, function(e, result){
        if (e) {
          return console.log(e);
        }
        // write the result
        fs.writeFileSync('result.ods', result);
    });
    return fileWrite;
}

module.exports = {
    exportFile
}
