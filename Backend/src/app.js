const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const indexRouter = require('../routes/index');

const app = express();

app.use(helmet());
app.use(cors());
app.use(logger('dev'));
app.use(express.json());

app.use('/api', indexRouter);

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