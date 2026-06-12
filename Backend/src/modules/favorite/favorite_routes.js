const express = require('express');
const authMiddleware = require('../../middlewares/auth.js');
const roleMiddleware = require('../../middlewares/role.js');
const validate = require('../../middlewares/validate.js');
const { addFavoriteRules } = require('./favorite_rules.js');
const favoriteController = require('./favorite_controller.js');

const router = express.Router();

// Solo clientes registrados
router.use(authMiddleware, roleMiddleware('Client'));

router.get('/',                  favoriteController.getFavorites);
router.post('/',                 validate(addFavoriteRules), favoriteController.addFavorite);
router.delete('/:id_favorite',   favoriteController.deleteFavorite);

module.exports = router;