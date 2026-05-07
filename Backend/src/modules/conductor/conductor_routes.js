const express = require('express');
const authMiddleware = require('../../middlewares/auth.js');
const checkRole = require('../../middlewares/role.js');
const validate = require('../../middlewares/validate.js');
const addConductorController = require('./conductor_controller.js');
const { crearConductorSchema, activarCuentaSchema, actualizarConductorSchema } = require('./conductor_rules.js');

const router = express.Router();

// Crear conductor — solo empresa autenticada
router.post('/', authMiddleware, checkRole('empresa'), validate(crearConductorSchema), addConductorController.agregarConductor);

// Activar cuenta — pública, no requiere token JWT
router.post('/activar', validate(activarCuentaSchema), addConductorController.activarCuenta);

router.get('/', authMiddleware, checkRole('empresa'), addConductorController.verTodosConductores);
router.get('/pendientes', authMiddleware, checkRole('empresa'), addConductorController.verConductoresPendientes);
router.get('/:id_conductor', authMiddleware, checkRole('empresa'), addConductorController.verConductor);
router.post('/', authMiddleware, checkRole('empresa'), validate(crearConductorSchema), addConductorController.agregarConductor);
router.put('/:id_conductor', authMiddleware, checkRole('empresa'), validate(actualizarConductorSchema), addConductorController.actualizarConductorEmpresa);
router.delete('/:id_conductor', authMiddleware, checkRole('empresa'), addConductorController.eliminarConductor);

module.exports = router;