const express = require('express');
const authMiddleware = require('../../middlewares/auth.js');
const roleMiddleware = require('../../middlewares/role.js');
const validate = require('../../middlewares/validate.js');
const { crearTrayectoSchema, actualizarTrayectoSchema } = require('./trayecto_rules.js');
const trayectoController = require('./trayecto_controller.js');

const router = express.Router({ mergeParams: true }); // mergeParams para acceder a linea_id

router.use(authMiddleware, roleMiddleware('empresa'));

router.get('/',                trayectoController.verTodasTrayectos);
router.get('/:id_trayecto',    trayectoController.verTrayecto);
router.post('/',               validate(crearTrayectoSchema),      trayectoController.crearTrayecto);
router.put('/:id_trayecto',    validate(actualizarTrayectoSchema), trayectoController.actualizarTrayecto);
router.delete('/:id_trayecto', trayectoController.eliminarTrayecto);

module.exports = router;