const express = require('express');
const sequelize = require('./config/database');
const librosRouter = require('./routes/libros');
const usuariosRouter = require('./routes/usuarios');

const app = express();
app.use(express.json());
const prestamosRouter = require('./routes/prestamos'); 
app.use('/api/prestamos', prestamosRouter);            

app.use('/api/libros', librosRouter);
app.use('/api/usuarios', usuariosRouter);

app.get('/', (req, res) => {
  res.json({ mensaje: '¡API Biblioteca funcionando!' });
});

const PORT = 3000;

// Middleware para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ mensaje: `Ruta ${req.method} ${req.url} no encontrada` });
});

// Middleware global de errores
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ mensaje: 'Error interno del servidor', error: err.message });
});

sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión a SQL Server exitosa');
    return sequelize.sync();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Error al conectar a la base de datos:', err);
  });