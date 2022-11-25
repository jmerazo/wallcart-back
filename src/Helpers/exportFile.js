const fs = require('fs');
const carbone = require('carbone');
const path = require('path');

let filePathFormat = path.join(__dirname + '/resources/format_validity.ods')

async function exportFile(dataExport){
    const data = await dataExport.reduce((accumulator, element, index) => {
        //acc[element.nombre] = element;
        accumulator[element.nombre] = element
        return accumulator
        }, 
    {})

    console.log('Data JSON: ',data)
    let fileWrite = await carbone.render(filePathFormat, dataExport, function(e, result){
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
