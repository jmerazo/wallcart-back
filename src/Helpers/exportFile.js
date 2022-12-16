const fs = require('fs');
const carbone = require('carbone');
const path = require('path');

let filePathFormat = path.join(__dirname + '/resources/format_ages.xlsx')
let filePathFormatState = path.join(__dirname + '/resources/format_collection_office.xlsx')

async function downloadFileFormat(fileName){    

    // Path at which image will get downloaded
    let fileBase = path.join(__dirname, '..', '..', fileName);
    let filePC = path.join(__dirname);
    //console.log('Filepath: ',fileBase)
    console.log(filePC)
    
    download(fileBase,filePC)
    .then(() => {
        console.log('Download Completed');
    })
    .catch((e) => {
        console.log('Error download: ',e)
    })
}

async function exportFile(dataExport){

    console.log(dataExport)
    let fileName = 'report_ages_hjmh.xlsx'

    await carbone.render(filePathFormat, dataExport, function(e, result){
        if (e) {
          return console.log(e);
        }
        fs.writeFileSync(fileName, result);
    });

    //await downloadFileFormat(fileName);
    return fileName;
}

async function exportFileState(dataExport){
    let fileName = 'collection_office.xlsx'

    await carbone.render(filePathFormatState, dataExport, function(e, result){
        if (e) {
          return console.log(e);
        }
        fs.writeFileSync(fileName, result);
    });

    return fileName;
}

async function exportFilePDF(dataExport){

    let fileName = 'report_ages_hjmh.xlsx'

    await carbone.render(filePathFormat, dataExport, function(e, result){
        if (e) {
          return console.log(e);
        }
        fs.writeFileSync(fileName, result);
    });

    let fileBase = path.join(__dirname, '..', '..', fileName);
    console.log('File base: ',fileBase)
    let fileBuffer = fs.readFileSync(fileBase);
    console.log('File read: ',fileBuffer)

    let options = {
        convertTo: 'pdf'
    };

    carbone.convert(fileBuffer, options, function (err, result) {
        if(err){
            console.log('Error convert: ', err)
        }
        fs.writeFileSync('report_ages_hjmh.pdf', result);
    });
    return fileName;
}

module.exports = {
    exportFile,
    exportFilePDF,
    exportFileState
}
