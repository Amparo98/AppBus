const express = require('express');
const authMiddleware = require('../../middlewares/auth.js');
const roleMiddleware = require('../../middlewares/role.js');
const validate = require('../../middlewares/validate.js');
const { addServiceRules, updateRules } = require('./assign_service_rules.js');
const serviceController = require('./assign_service_controller.js');

const router = express.Router();

router.use(authMiddleware, roleMiddleware('Company'));

router.get('/',               serviceController.getAllService); //comprobado
router.get('/:id_service',    serviceController.getService);//comprobado
router.post('/',              validate(addServiceRules), serviceController.addService); //comprobado
router.put('/:id_service',    validate(updateRules), serviceController.updateService);
router.delete('/:id_service', serviceController.deleteService);

// Rutas conductor
router.get('/driver/my_service', authMiddleware, roleMiddleware('Driver'), serviceController.getServiceDriver);
router.patch('/:id_service/start', authMiddleware, roleMiddleware('Driver'), serviceController.startService);
router.patch('/:id_service/finish', authMiddleware, roleMiddleware('Driver'), serviceController.finishService);

module.exports = router;