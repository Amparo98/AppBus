const express = require('express');
const authMiddleware = require('../middlewares/auth.js');
const checkRole = require('../middlewares/role.js');
const validate = require('../middlewares/validate.js');
const lineaController = require('../controller/linea.js');
const { crearLineaSchema, actualizarLineaSchema } = require('../schemas/linea.js');

const router = express.Router();

// Todas las rutas requieren estar autenticado y ser empresa
router.use(authMiddleware, checkRole('empresa'));

router.get('/',            lineaController.verTodasLineas);
router.get('/:codigo',   lineaController.verLinea);
router.post('/',           validate(crearLineaSchema),       lineaController.crearLinea);
router.put('/:codigo',   validate(actualizarLineaSchema),  lineaController.actualizarLinea);
router.delete('/:codigo', lineaController.eliminarLinea);

module.exports = router;