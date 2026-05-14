const express = require('express');
const authMiddleware = require('../../middlewares/auth.js');
const roleMiddleware = require('../../middlewares/role.js');
const validate = require('../../middlewares/validate.js');
const { addIncidenceRules, updateIncidenceRules } = require('./incidence_rules.js');
const incidenceController = require('./incidence_controller.js');

const router = express.Router();

// Conductor crea incidencias, empresa las gestiona
router.get('/',                    authMiddleware, roleMiddleware('Company'), incidenceController.getAllIncidence);
router.get('/:id_incidence',      authMiddleware, roleMiddleware('Company'), incidenceController.getIncidence);
router.post('/',                   authMiddleware, roleMiddleware('Driver'), validate(addIncidenceRules), incidenceController.addIncidence);
router.put('/:id_incidence',      authMiddleware, roleMiddleware('Company'), validate(updateIncidenceRules), incidenceController.updateIncidence);
router.delete('/:id_incidence',   authMiddleware, roleMiddleware('Company'), incidenceController.deleteIncidence);

module.exports = router;