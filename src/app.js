const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const session = require('express-session');
const validator = require('express-validator');
const passport = require('passport');
const flash = require('connect-flash');
const paginate = require('express-paginate');

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

//Router
const services = require('./router/routes');
const auth = require('./router/auth')
app.use('/api', services);
app.use('/api-auth', auth);

// Port listening
app.listen(port)
    console.log('API listening in the port: ' + port);

module.exports = {
    app
};