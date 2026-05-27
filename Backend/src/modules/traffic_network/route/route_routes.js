const express = require('express');
const authMiddleware = require('../../../middlewares/auth.js');
const roleMiddleware = require('../../../middlewares/role.js');
const validate = require('../../../middlewares/validate.js');
const { addRouteRules, updateRouteRules } = require('./route_rules.js');
const routeController = require('./route_controller.js');

const router = express.Router({ mergeParams: true }); // mergeParams para acceder a linea_id

 //redes privadas para la empresa
router.get('/', authMiddleware, roleMiddleware('Company'), validate(addRouteRules), routeController.getAllRoute);
router.get('/:id_route', authMiddleware, roleMiddleware('Company'), validate(addRouteRules), routeController.getRoute);
router.post('/', authMiddleware, roleMiddleware('Company'), validate(addRouteRules), validate(addRouteRules),      routeController.addRoute);
router.put('/:id_route', authMiddleware, roleMiddleware('Company'), validate(addRouteRules), validate(updateRouteRules), routeController.updateRoute);
router.delete('/:id_route', authMiddleware, roleMiddleware('Company'), validate(addRouteRules), routeController.deleteRoute);


//Elementos publicos para usuarios no reqistrados
router.get('/', routeController.getAllRoute);
router.get('/:id_route', routeController.getRoute);
module.exports = router;