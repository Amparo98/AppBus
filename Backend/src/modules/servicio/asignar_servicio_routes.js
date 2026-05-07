const express = require('express');
const authMiddleware = require('../../middlewares/auth.js');
const roleMiddleware = require('../../middlewares/role.js');
const validate = require('../../middlewares/validate.js');
const { crearServicioSchema, actualizarServicioSchema } = require('./asignar_servicio_rules.js');
const servicioController = require('./asignar_servicio_controller.js');

const router = express.Router();

router.use(authMiddleware, roleMiddleware('empresa'));

router.get('/',                  servicioController.verServicios);
router.get('/:id_asignacion',    servicioController.verServicio);
router.post('/',                 validate(crearServicioSchema), servicioController.crearServicio);
router.put('/:id_asignacion',    validate(actualizarServicioSchema), servicioController.actualizarServicio);
router.delete('/:id_asignacion', servicioController.eliminarServicio);
// Ruta conductor — ver sus propios servicios
router.get('/conductor/mis_servicios', authMiddleware, roleMiddleware('conductor'), servicioController.verServicios);
module.exports = router;