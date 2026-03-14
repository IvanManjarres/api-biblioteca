const express = require('express');
const sequelize = require('./config/database');
const librosRouter = require('./routes/libros');
const usuariosRouter = require('./routes/usuarios'); // ← agregar

const app = express();
app.use(express.json());

app.use('/api/libros', librosRouter);
app.use('/api/usuarios', usuariosRouter); // ← agregar

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