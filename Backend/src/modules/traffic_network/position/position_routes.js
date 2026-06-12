const express = require('express');
const authMiddleware = require('../../../middlewares/auth.js');
const roleMiddleware = require('../../../middlewares/role.js');
const validate = require('../../../middlewares/validate.js');
const { savePositionRules } = require('./position_rules.js');
const positionController = require('./position_controller.js');

const router = express.Router();

router.post('/',  authMiddleware,  roleMiddleware('Driver'),  validate(savePositionRules), positionController.savePosition);

// Empresa consulta posiciones
router.get('/',  authMiddleware,  roleMiddleware('Company'),  positionController.getLastPositionsByCompany);
router.get('/:id_bus',  authMiddleware,  roleMiddleware('Company'),  positionController.getLastPosition);



module.exports = router;