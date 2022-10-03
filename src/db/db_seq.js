const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
    `${process.env.DB_NAME}`, 
    `${process.env.DB_USER}`, 
    `${process.env.DB_PASS}`, 
    {
        host: `${process.env.DB_HOST}`,
        dialect: 'mysql',
        port: process.env.DB_PORT
    }
)

sequelize.authenticate()
    .then(() => {
        console.log('Connect database sequelize')
    })
    .catch(err => {
        console.log('Error connect database')
    })


const abonos = sequelize.define("abonos", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey,
        autoIncrement
    },
    nit: {
        type: DataTypes.STRING,
    },
    factura: {
        type: DataTypes.STRING,
    },
    num_cto: {
        type: DataTypes.STRING,
    },
    fecha_pago: {
        type: DataTypes.DATE,
    },
    valor_abonado: {
        type: DataTypes.DOUBLE,
    },
    glosas: {
        type: DataTypes.DOUBLE,
    },
    total_glosas: {
        type: DataTypes.DOUBLE,
    },
    observacion: {
        type: DataTypes.STRING,
    }
});

sequelize.sync().then(() => {
    console.log('Abono table created successfully!');
 }).catch((error) => {
    console.error('Unable to create table : ', error);
 });


 module.exports = sequelize;