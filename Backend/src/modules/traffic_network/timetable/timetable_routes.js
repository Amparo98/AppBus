const express = require('express');
const authMiddleware = require('../../../middlewares/auth.js');
const roleMiddleware = require('../../../middlewares/role.js');
const validate = require('../../../middlewares/validate.js');
const { addTimetableRules } = require('./timetable_rules.js');
const timeController = require('./timetable_controller.js');

const router = express.Router();

// Rutas públicas — cualquiera puede consultar horarios
router.get('/route/:id_route', timeController.getTimetableByRoute);
router.get('/stop/:id_stop',   timeController.getTimetableByStop);

// Rutas empresa — gestión de horarios
router.post('/', authMiddleware,  roleMiddleware('company'),  validate(addTimetableRules),  timeController.addTimetable);
router.delete('/:id_timetable',  authMiddleware,  roleMiddleware('company'),  timeController.deleteTimetable);

module.exports = router;