const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Libro = require('./libro');
const Usuario = require('./usuario');

const Prestamo = sequelize.define('Prestamo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  libroId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Libros', key: 'id' }
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Usuarios', key: 'id' }
  },
  fechaPrestamo: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  fechaDevolucion: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  }
}, {
  tableName: 'Prestamos',
  timestamps: true
});

Prestamo.belongsTo(Libro,   { foreignKey: 'libroId',   as: 'libro' });
Prestamo.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

module.exports = Prestamo;