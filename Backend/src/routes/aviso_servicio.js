const express = require('express');
const authMiddleware = require('../middlewares/auth.js');
const roleMiddleware = require('../middlewares/role.js');
const validate = require('../middlewares/validate.js');
const { crearAvisoSchema, actualizarAvisoSchema } = require('../schemas/aviso_servicio.js');
const avisoController = require('../controller/aviso_servicio.js');

const router = express.Router();

router.use(authMiddleware, roleMiddleware('empresa'));

router.get('/',            avisoController.verAvisos);
router.get('/:id_aviso',   avisoController.verAviso);
router.post('/',           validate(crearAvisoSchema),      avisoController.crearAviso);
router.put('/:id_aviso',   validate(actualizarAvisoSchema), avisoController.actualizarAviso);
router.delete('/:id_aviso', avisoController.eliminarAviso);

module.exports = router;