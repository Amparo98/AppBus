const express = require('express');
const authMiddleware = require('../../../middlewares/auth.js');
const roleMiddleware = require('../../../middlewares/role.js');
const validate = require('../../../middlewares/validate.js');
const { addRouteRules, updateRouteRules } = require('./route_rules.js');
const routeController = require('./route_controller.js');

const router = express.Router({ mergeParams: true }); // mergeParams para acceder a linea_id

router.use(authMiddleware, roleMiddleware('Company'));

router.get('/',                routeController.getAllRoute);
router.get('/:id_route',    routeController.getRoute);
router.post('/',               validate(addRouteRules),      routeController.addRoute);
router.put('/:id_route',    validate(updateRouteRules), routeController.updateRoute);
router.delete('/:id_route', routeController.deleteRoute);

module.exports = router;