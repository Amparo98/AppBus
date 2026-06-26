const express = require('express');
const authMiddleware = require('../../middlewares/auth.js');
const roleMiddleware = require('../../middlewares/role.js');
const validate = require('../../middlewares/validate.js');
const { updateProfileRules, updatePasswordRules } = require('./client_rules.js');
const clientController = require('./client_controller.js');

const router = express.Router();

router.use(authMiddleware, roleMiddleware('Client'));

router.get('/profile',           clientController.getProfile);
router.put('/profile',           validate(updateProfileRules),  clientController.updateProfile);
router.patch('/password',        validate(updatePasswordRules), clientController.updatePassword);

module.exports = router;