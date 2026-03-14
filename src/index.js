const express = require('express');
const sequelize = require('./config/database');
const librosRouter = require('./routes/libros');

const app = express();
app.use(express.json());

// Rutas
app.use('/api/libros', librosRouter);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: '¡API Biblioteca funcionando!' });
});

const PORT = 3000;

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