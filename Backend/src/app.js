const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/auth');
const errorMiddleware = require('./middlewares/error');

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3005',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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

app.use(errorMiddleware);

module.exports = app;


