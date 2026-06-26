const express = require('express');
const authMiddleware = require('../../../middlewares/auth.js');
const roleMiddleware = require('../../../middlewares/role.js');
const shiftController = require('./shift_log_controller.js');

const router = express.Router();

// Rutas empresa — ver conductores fichados
router.get('/active', authMiddleware, roleMiddleware('Company'), shiftController.getActiveShifts);

// Rutas conductor
router.get('/my-shift', authMiddleware, roleMiddleware('Driver'), shiftController.getOpenShift);
router.get('/history',  authMiddleware, roleMiddleware('Driver'), shiftController.getShiftsByDriver);
router.post('/start',   authMiddleware, roleMiddleware('Driver'), shiftController.startShift);
router.patch('/end',    authMiddleware, roleMiddleware('Driver'), shiftController.endShift);

module.exports = router;