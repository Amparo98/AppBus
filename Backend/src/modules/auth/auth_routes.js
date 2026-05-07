const express = require('express');
const rateLimit = require('express-rate-limit');
const authController = require('./auth_controller.js');
const authMiddleware = require('../../middlewares/auth.js');
const validate = require('../../middlewares/validate.js');
const { loginRules, registerClientRules, registerCompanyRules } = require('./auth_rules.js');

const router = express.Router();

/*Limita cuántas peticiones puede hacer una misma IP en un periodo de tiempo
 para evitar ataques de fuerza bruta en el login*/

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // ventana de 15 minutos
  max: 10,                   // máximo 10 intentos por IP
  standardHeaders: true,     // devuelve info del límite en headers RateLimit-*
  legacyHeaders: false,      // desactiva headers X-RateLimit-* antiguos
  message: {
    ok: false,
    code: 'TOO_MANY_REQUESTS',
    message: 'Demasiados intentos de login, espera 15 minutos'
  }
});

// Rutas de autenticación
router.post('/client/loginClient', loginLimiter, validate(loginRules), authController.loginClient);
router.post('/company/loginCompany', loginLimiter, validate(loginRules), authController.loginCompany);
router.post('/busDriver/loginBusDriver', loginLimiter, validate(loginRules), authController.loginBusDriver);
router.get('/me', authMiddleware, authController.me);

// Rutas de registro
router.post('/client/registerClient', validate(registerClientRules), authController.registerClient);
router.post('/company/registerCompany', validate(registerCompanyRules), authController.registerCompany);

module.exports = router;