const express = require('express');
const authMiddleware = require('../../middlewares/auth.js');
const roleMiddleware = require('../../middlewares/role.js');
const validate = require('../../middlewares/validate.js');
const { addAlertRules, updateAlertRules } = require('./alert_rules.js');
const alertController = require('./alert_controller.js');

const router = express.Router();

router.use(authMiddleware, roleMiddleware('Company'));

router.get('/',            alertController.getAllAlert);
router.get('/:id_alert',   alertController.getAlert);
router.post('/',           validate(addAlertRules),      alertController.addAlert);
router.put('/:id_alert',   validate(updateAlertRules), alertController.updateAlert);
router.delete('/:id_alert', alertController.deleteAlert);

module.exports = router;