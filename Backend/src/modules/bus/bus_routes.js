const express = require('express');
const authMiddleware = require('../../middlewares/auth.js');
const roleMiddleware = require('../../middlewares/role.js');
const validate = require('../../middlewares/validate.js');
const { crearBusSchema, actualizarBusSchema } = require('./bus_rules.js');
const busController = require('./bus_controller.js');

const router = express.Router();

router.use(authMiddleware, roleMiddleware('empresa'));

router.get('/',          busController.verTodosBuses);
router.get('/:id_bus',   busController.verBus);
router.post('/',         validate(crearBusSchema),      busController.crearBus);
router.put('/:id_bus',   validate(actualizarBusSchema), busController.actualizarBus);
router.delete('/:id_bus', busController.eliminarBus);

module.exports = router;