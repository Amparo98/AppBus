const express = require('express');
const authMiddleware = require('../../../middlewares/auth.js');
const roleMiddleware = require('../../../middlewares/role.js');
const validate = require('../../../middlewares/validate.js');
const { addStopRules, updateStopRules, addRouteStopRules } = require('./stop_rules.js');
const stopController = require('./stop_controller.js');

const router = express.Router();

//Publico
router.get('/',                              stopController.getAllStop);
router.get('/route/:id_route',               stopController.getStopsByRoute);
router.get('/:id_stop/arrival/:id_route',    stopController.getArrivalTime);
router.get('/:id_stop',                      stopController.getStop);


//Privado
router.use(authMiddleware, roleMiddleware('Company'));
router.post('/',                             validate(addStopRules),       stopController.addStop);
router.put('/:id_stop',                      validate(updateStopRules),    stopController.updateStop);
router.delete('/:id_stop',                                                 stopController.deleteStop);
router.post('/route/:id_route',              validate(addRouteStopRules),  stopController.addStopToRoute);
router.delete('/route/stop/:id_route_stop',                                stopController.removeStopFromRoute);

module.exports = router;