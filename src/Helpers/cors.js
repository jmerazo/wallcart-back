// White the list
var whiteList = [
    'http://localhost:8080',
    'http://10.0.2.15:8080',
    'http://10.0.2.15:8844',
    'http://localhost:8080'
]

var corsOption = {
    origin: (origin, callback) => {
        if(whiteList.indexOf(origin) != -1){
            callback(null, true)
        }else{
            callback(new Error('Not allowed by CORS'))
        }
    }
}

module.exports = {
    corsOption
}