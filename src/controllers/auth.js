const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userAuthModel = require('../models/auth');
const { response } = require('express');

const userAuthCreate = async (req, res) => {
    try {        
        var {doc_type_id, doc_number, names, last_names, phone, email, password, rol_id} = req.body;
        console.log(doc_type_id," ",doc_number," ",names," ",last_names," ",phone," ",email," ",password," ",rol_id);
        
        if(!email && !password){
            res.status(400).send('All input is required');
        }

        encryptedPassword = await bcrypt.hash(password, 10);
        console.log("Pass encyrpt: ", encryptedPassword);

        await userAuthModel.userAuthByEmail(email, (data, err) => {
            if(err){
                console.log("error validate: ",err)
            }else{
                if(data.length > 0){
                    console.log("desde validate: ",data[0,0].email)
                    return res.status(409).send(`User ${data[0,0].email} already exist. Please login`);
                    //return `${data[0,0].username}`;
                }else{
                    const userAuthData = {
                        doc_type_id : req.body.doc_type_id,
                        doc_number : req.body.doc_number,
                        names : req.body.names,
                        last_names : req.body.last_names,
                        phone : req.body.phone,
                        email : req.body.email.toLowerCase(),
                        password: encryptedPassword,
                        rol_id : req.body.rol_id.id
                    }

                    const rol = req.body.rol_id.id

                    userAuthModel.createUserAuthModel(userAuthData, (err, login) => {
                        if(err){
                            console.log("Rta no id", err)
                        }else{
                            console.log("Id creado en model: ", login)
                            const token = jwt.sign(
                                { user_id : login, email },
                                process.env.TOKEN_KEY,
                                {expiresIn: '2h'}
                            )
        
                            console.log("Token: ",token);
        
                            login.token = token;
        
                            res.send(data).status(201);
                        }
                    });                    
                }
            }
        });       
    } catch (err) {
        console.log(err);        
    }
}

const updatePassAuthLogin = async (req, res) => {
    try {        
        var {password} = req.body;
        console.log("Password: ",password);

        if(!password){
            res.status(400).send('All input is required');
        }

        encryptedPassword = await bcrypt.hash(password, 10);

        const userAuthData = {
            password: encryptedPassword
        }

        console.log("Password encrypted: ", userAuthData.password);
        const uid = req.params.id;
        console.log("Id User: ", uid)
        userAuthModel.updatePassAuthModel(uid, userAuthData, (err, login) => {
            if(!uid){
                res.status(400).send({
                    message: `User not found with id ${uid}`
                })
            }
            if(err){
                res.status(500).send({
                    message: `Error updating User with id ${uid}`
                })
            }else res.send(login).status(200);                            
        });       
    } catch (err) {
        console.log(err);        
    }
}

const updateStatusController = async (req, res) => {
    try {        
        var {status} = req.body;
        console.log("Status: ",status)       
        if(!status) res.status(400).send('All input is required')
        const uid = req.params.id;
        console.log("UID: ", uid)

        //const dataStatus = {
        //    status : req.body
        //}

        status = req.body;

        userAuthModel.updateStatusModel(uid, status, (err, stat) => {
            if(!uid){
                res.status(400).send({
                    message: `User not found with id ${uid}`
                })
            }
            if(err){
                res.status(500).send({
                    message: `Error updating User with id ${uid}`
                })
            }else res.send(stat).status(200);                            
        });       
    } catch (err) {
        console.log(err);        
    }
}

const userAuthLogin = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email && !password){
            res.status(400).send('All input is required');
        }

        userAuthModel.userAuthByEmail(email, async (user, err) => {
            if(user == ""){
                console.log(`User ${email} not found`, err);
                res.sendStatus(403);
            }else{
                const userData = {
                    id : user[0,0].id,
                    email : user[0,0].email,
                    password : user[0,0].password,
                    rol_id : user[0,0].rol_id,
                    status : user[0,0].status
                }
                if(userData &&(await bcrypt.compare(password, userData.password))){
                    const token = jwt.sign(
                        {user_id: userData.id, email},
                        process.env.TOKEN_KEY,
                        {expiresIn: "2h"}
                    );    
                    userData.token = token;        
                    res.json(userData);
                }else{
                    res.status(400).send('Invalid credentials'); 
                }          
            }
            
        });       
    } catch (error) {
        console.log(error);        
    }
}

const userAuthLogout = async (req, res) => {
    const authHeader = req.headers['authorization'];
    jwt.sign(authHeader, "", {expiresIn: 1}, (logout, err) => {
        if(logout){
            res.send({msg: 'User logout'});
        }else{
            res.send({msg: 'Error'});
        }
    })
}

module.exports = {
    userAuthCreate,
    userAuthLogin,
    userAuthLogout,
    updatePassAuthLogin,
    updateStatusController
}