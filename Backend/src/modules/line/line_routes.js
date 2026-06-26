const express = require('express');
const authMiddleware = require('../../middlewares/auth.js');
const checkRole = require('../../middlewares/role.js');
const validate = require('../../middlewares/validate.js');
const lineController = require('./line_controller.js');
const { addLineRules, updateLineRules } = require('./line_rules.js');
const router = express.Router();

// Autenticación obligatoria para todas las rutas
router.use(authMiddleware);

// Lectura — Company y Client
router.get('/', lineController.getAllLine);
router.get('/:code', lineController.getLine);

// Escritura — solo Company
router.use(checkRole('Company'));
router.post('/',         validate(addLineRules),    lineController.addLine);
router.put('/:code',     validate(updateLineRules), lineController.updateLine);
router.delete('/:code',                             lineController.deleteLine);

module.exports = router;