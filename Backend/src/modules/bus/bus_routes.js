const express = require('express');
const authMiddleware = require('../../middlewares/auth.js');
const roleMiddleware = require('../../middlewares/role.js');
const validate = require('../../middlewares/validate.js');
const { addBusRules, updateBusRules } = require('./bus_rules.js');
const busController = require('./bus_controller.js');

const router = express.Router();

router.use(authMiddleware, roleMiddleware('Company'));

router.get('/',          busController.getAllBuses);
router.get('/:id_bus',   busController.getBus);
router.get('/active',    busController.getActiveBusesByCompany);
router.post('/',         validate(addBusRules),      busController.addBus);
router.put('/:id_bus',   validate(updateBusRules), busController.updateBus);
router.delete('/:id_bus', busController.deleteBus);


module.exports = router;