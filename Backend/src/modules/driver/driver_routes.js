const express = require('express');
const authMiddleware = require('../../middlewares/auth.js');
const checkRole = require('../../middlewares/role.js');
const validate = require('../../middlewares/validate.js');
const driverController = require('./driver_controller.js');
const { addDriverRules, updateDriverRules, activateAccountRules } = require('./driver_rules.js');

const router = express.Router();

// Crear conductor — solo empresa autenticada
router.post('/', authMiddleware, checkRole('Company'), validate(addDriverRules), driverController.addDriver);//comprobado

// Activar cuenta — pública, no requiere token JWT
router.post('/activate', validate(activateAccountRules), driverController.activeAccount);//comprobadon

router.get('/', authMiddleware, checkRole('Company'), driverController.getAllDriver);//comprobado
router.get('/pending', authMiddleware, checkRole('Company'), driverController.getPendingDrivers);//comprobado
router.get('/:id_driver', authMiddleware, checkRole('Company'), driverController.getDriver);//comprobado
router.put('/:id_driver', authMiddleware, checkRole('Company'), validate(updateDriverRules), driverController.updateDriverByCompany);
router.delete('/:id_driver', authMiddleware, checkRole('Company'), driverController.deleteDriver);

module.exports = router;