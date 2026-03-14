const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('biblioteca_db', 'sa', '123456', {
  host: 'LAB-LIS-014\\SQLEXPRESS',
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