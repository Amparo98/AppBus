const express = require('express');
const rateLimit = require('express-rate-limit');
const adminController = require('./admin_controller.js');
const authMiddleware = require('../../middlewares/auth.js');
const checkRole = require('../../middlewares/role.js');
const validateParams = require('../../middlewares/validateParams.js');
const { idCompanyParamRules } = require('./admin_rules.js');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false
});

router.post('/login', loginLimiter, adminController.loginAdmin);

router.use(authMiddleware, checkRole('Admin'));
router.get('/companies/pending', adminController.getPendingCompanies);
router.put('/companies/:id_company/approve', validateParams(idCompanyParamRules), adminController.approveCompany);
router.put('/companies/:id_company/reject',  validateParams(idCompanyParamRules), adminController.rejectCompany);

module.exports = router;