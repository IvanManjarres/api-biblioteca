const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('biblioteca_db', 'sa', '123456', {
  host: 'localhost',
  dialect: 'mssql',
  dialectOptions: {
    options: {
      encrypt: false,
      trustServerCertificate: true,
      instanceName: 'SQLEXPRESS',
      useNamedPipes: true,
    }
  },
  logging: false
});

module.exports = sequelize;