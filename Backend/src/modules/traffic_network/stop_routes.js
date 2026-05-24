const express = require('express');
const authMiddleware = require('../../middlewares/auth.js');
const roleMiddleware = require('../../middlewares/role.js');
const validate = require('../../middlewares/validate.js');
const { addStopRules, updateStopRules, addRouteStopRules } = require('./stop_rules.js');
const stopController = require('./stop_controller.js');

const router = express.Router();

// Rutas públicas — cualquiera puede ver paradas
router.get('/',          stopController.getAllStop);
router.get('/:id_stop',  stopController.getStop);

// Paradas de un trayecto — pública
router.get('/route/:id_route',               stopController.getStopsByRoute);

// Tiempo estimado de llegada — pública
router.get('/:id_stop/arrival/:id_route',    stopController.getArrivalTime);

// Gestión de paradas — solo empresa
router.post('/',         authMiddleware, roleMiddleware('company'), validate(addStopRules),    stopController.addStop);
router.put('/:id_stop',  authMiddleware, roleMiddleware('company'), validate(updateStopRules), stopController.updateStop);
router.delete('/:id_stop', authMiddleware, roleMiddleware('company'), stopController.deleteStop);

// Gestión de paradas en trayecto — solo empresa
router.post('/route/:id_route',                    authMiddleware, roleMiddleware('company'), validate(addRouteStopRules), stopController.addStopToRoute);
router.delete('/route/stop/:id_route_stop',        authMiddleware, roleMiddleware('company'), stopController.removeStopFromRoute);

module.exports = router;