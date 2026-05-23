const express = require('express');
const authMiddleware = require('../../middlewares/auth.js');
const roleMiddleware = require('../../middlewares/role.js');
const validate = require('../../middlewares/validate.js');
const { addIncidenceRules, updateIncidenceRules } = require('./incident_rules.js');
const incidentController = require('./incident_controller.js');

const router = express.Router();

router.get('/',              authMiddleware, roleMiddleware('Company'),  incidentController.getAllIncident);
router.get('/:id_incident',  authMiddleware, roleMiddleware('Company'),  incidentController.getIncident);
router.post('/',             authMiddleware, roleMiddleware('Driver'),   validate(addIncidenceRules), incidentController.addIncident);
router.put('/:id_incident',  authMiddleware, roleMiddleware('Company'),  validate(updateIncidenceRules), incidentController.updateIncident);
router.delete('/:id_incident', authMiddleware, roleMiddleware('Company'), incidentController.deleteIncident);

module.exports = router;