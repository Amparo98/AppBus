const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/auth');

const app = express();

app.use(helmet());
app.use(cors());
app.use(logger('dev'));
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({
    ok: true,
    message: 'Backend funcionando correctamente'
  });
});

app.use('/api/auth', authRoutes);

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    message: 'Ruta no encontrada'
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    ok: false,
    message: err.message || 'Error interno del servidor'
  });
});

module.exports = app;