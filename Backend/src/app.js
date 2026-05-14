const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./modules/auth/auth_routes.js');
const errorMiddleware = require('./middlewares/error');
const healthRouter = require('./routes/health.js');
const lineaRoutes = require('./modules/linea/linea_routes.js');
const trayectoRoutes = require('./modules/red_transporte/trayecto_routes.js');
const driverRoutes = require('./modules/driver/driver_routes.js');
const busRoutes = require('./modules/bus/bus_routes.js');
const servicioRoutes = require('./modules/servicio/asignar_servicio_routes.js');
const incidenciaRoutes = require('./modules/incidencia/incidencia_routes.js');
const avisoServicioRoutes = require('./modules/servicio/aviso_servicio_routes.js');

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
app.use('/api/auth', authRoutes); //corregido
app.use('/api/lineas/:linea_id/trayectos', trayectoRoutes);
app.use('/api/lineas', lineaRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/bus', busRoutes); //corregido
app.use('/api/servicios', servicioRoutes);
app.use('/api/incidencias', incidenciaRoutes);
app.use('/api/avisos', avisoServicioRoutes);

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    message: 'Ruta no encontrada'
  });
});

app.use(errorMiddleware);

module.exports = app;


