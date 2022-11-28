const fs = require('fs');
const carbone = require('carbone');
const path = require('path');
const download = require('download');

let filePathFormat = path.join(__dirname + '/resources/format_validity.xlsx')

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

async function exportFilePDF(dataExport){

    let fileName = 'report_ages_hjmh.xlsx'

    await carbone.render(filePathFormat, dataExport, function(e, result){
        if (e) {
          return console.log(e);
        }
        fs.writeFileSync(fileName, result);
    });

    let fileBase = path.join(__dirname, '..', '..', fileName);
    var fileBuffer = fs.readFileSync(fileBase);

    let options = {
        convertTo: 'pdf'
    };

    await carbone.convert(fileBuffer, options, function (err, result) {
        fs.writeFileSync('report_ages_hjmh.pdf', result);
    });
    return fileName;
}

module.exports = {
    exportFile,
    exportFilePDF
}
