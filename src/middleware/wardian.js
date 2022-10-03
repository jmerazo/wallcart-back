const { config } = require('dotenv');
const jwt = require('jsonwebtoken')

const verifyToken = async(req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    console.log(bearerHeader);

    if(typeof bearerHeader !== 'undefined'){
        const bearerToken = bearerHeader.split(" ")[1];
        req.token = bearerToken;
        console.log("token: ", req.token);
        next();
    }else{
        res.sendStatus(403);
    }
}

module.exports = verifyToken;