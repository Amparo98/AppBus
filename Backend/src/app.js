const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./modules/auth/auth_routes.js');
const errorMiddleware = require('./middlewares/error');
const healthRouter = require('./routes/health.js');
const lineRoutes = require('./modules/line/line_routes.js');
const routeRoutes = require('./modules/traffic_network/route_routes.js');
const driverRoutes = require('./modules/driver/driver_routes.js');
const busRoutes = require('./modules/bus/bus_routes.js');
const serviceRoutes = require('./modules/services/assign_service_routes.js');
const incidentRoutes = require('./modules/incident/incident_routes.js');
const alertServicioRoutes = require('./modules/alert/alert_routes.js');
const stopRoutes = require('./modules/traffic_network/stop_routes.js');
const shiftRoutes = require ('./modules/driver/shift_log/shift_log_routes.js')

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
app.use('/api/line/:line_id/route', routeRoutes);
app.use('/api/line', lineRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/bus', busRoutes); //corregido
app.use('/api/service', serviceRoutes);
app.use('/api/incident', incidentRoutes);
app.use('/api/alert', alertServicioRoutes);
app.use('/api/stop', stopRoutes);
app.use('/api/shift', shiftRoutes);

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    message: 'Ruta no encontrada'
  });
});

app.use(errorMiddleware);

module.exports = app;


