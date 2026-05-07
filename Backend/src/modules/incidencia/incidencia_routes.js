const express = require('express');
const authMiddleware = require('../../middlewares/auth.js');
const roleMiddleware = require('../../middlewares/role.js');
const validate = require('../../middlewares/validate.js');
const { crearIncidenciaSchema, actualizarIncidenciaSchema } = require('./incidencia_rules.js');
const incidenciaController = require('./incidencia_controller.js');

const router = express.Router();

// Conductor crea incidencias, empresa las gestiona
router.get('/',                    authMiddleware, roleMiddleware('empresa'), incidenciaController.verIncidencias);
router.get('/:id_incidencia',      authMiddleware, roleMiddleware('empresa'), incidenciaController.verIncidencia);
router.post('/',                   authMiddleware, roleMiddleware('conductor'), validate(crearIncidenciaSchema), incidenciaController.crearIncidencia);
router.put('/:id_incidencia',      authMiddleware, roleMiddleware('empresa'), validate(actualizarIncidenciaSchema), incidenciaController.actualizarIncidencia);
router.delete('/:id_incidencia',   authMiddleware, roleMiddleware('empresa'), incidenciaController.eliminarIncidencia);

module.exports = router;