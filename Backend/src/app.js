const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/auth');
const errorMiddleware = require('./middlewares/error');
const healthRouter = require('./routes/health.js');
const lineaRoutes = require('./routes/linea.js');
const trayectoRoutes = require('./routes/trayecto.js');
const addConductorRoutes = require('./routes/add_conductor.js');

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3005',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(logger('dev'));
app.use(express.json());

app.use('/api/health', healthRouter);
app.use('/api/auth', authRoutes);
app.use('/api/lineas/:linea_id/trayectos', trayectoRoutes);
app.use('/api/lineas', lineaRoutes);
app.use('/api/conductores', addConductorRoutes);


app.use((req, res) => {
  res.status(404).json({
    ok: false,
    message: 'Ruta no encontrada'
  });
});

app.use(errorMiddleware);

module.exports = app;


