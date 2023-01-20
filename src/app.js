const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const expressSession = require('express-session');
const validator = require('express-validator');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const MySQLStore = require('express-mysql-session')(session);
const flash = require('connect-flash');
const paginate = require('express-paginate');
const cookieParser = require('cookie-parser')

const app = express();

//var router = express.Router();

require('dotenv').config()

//Database connect
require('./db/con_db')

//Define port
var port = process.env.PORT || 8844

//Use apps
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'views')));
app.use(paginate.middleware(10, 50));
app.use(expressSession({
    secret: 'mySecretKey',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize())
app.use(passport.session());
app.use(cookieParser('nothing else matters'))

//Router
const services = require('./router/routes');
const auth = require('./router/auth');
const { session } = require('passport');
app.use('/api', services);
app.use('/api-auth', auth);

// Port listening
app.listen(port)
    console.log('API listening in the port: ' + port);

module.exports = {
    app
};