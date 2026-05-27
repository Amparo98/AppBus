const express = require('express');
const authMiddleware = require('../../middlewares/auth.js');
const checkRole = require('../../middlewares/role.js');
const validate = require('../../middlewares/validate.js');
const lineController = require('./line_controller.js');
const { addLineRules, updateLineRules } = require('./line_rules.js');

const router = express.Router();

// Todas las rutas requieren estar autenticado y ser empresa
router.use(authMiddleware, checkRole('Company'));

router.get('/',            lineController.getAllLine);//correcto
router.get('/:code',   lineController.getLine);//correcto
router.post('/',           validate(addLineRules),       lineController.addLine); //correcto
router.put('/:code',   validate(updateLineRules),  lineController.updateLine); //corecto
router.delete('/:code', lineController.deleteLine);//correcto

//Rutas publicas para que el usuarios no registrados pueda verlas pero no modificarlas
router.get('/', lineController.getAllLine);
router.get('/:code', lineController.getLine);

module.exports = router;