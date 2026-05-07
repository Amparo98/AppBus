const express = require('express');
const authMiddleware = require('../middlewares/auth.js');
const roleMiddleware = require('../middlewares/role.js');
const validate = require('../middlewares/validate.js');
const { crearServicioSchema, actualizarServicioSchema } = require('../schemas/asignar_servicio.js');
const servicioController = require('../controller/asignar_servicio.js');

const router = express.Router();

router.use(authMiddleware, roleMiddleware('empresa'));

router.get('/',                  servicioController.verServicios);
router.get('/:id_asignacion',    servicioController.verServicio);
router.post('/',                 validate(crearServicioSchema), servicioController.crearServicio);
router.put('/:id_asignacion',    validate(actualizarServicioSchema), servicioController.actualizarServicio);
router.delete('/:id_asignacion', servicioController.eliminarServicio);
// Ruta conductor — ver sus propios servicios
router.get('/conductor/mis-servicios', authMiddleware, roleMiddleware('conductor'), servicioController.verServiciosConductor);
module.exports = router;