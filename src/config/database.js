const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('biblioteca_db', 'sa', 'Biblioteca123', {
  host: '192.168.137.84',
  port: 1433,
  dialect: 'mssql',
  dialectOptions: {
    options: {
      encrypt: false,
      trustServerCertificate: true,
    }
  },
  logging: false
});

module.exports = sequelize;