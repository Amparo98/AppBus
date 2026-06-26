const express = require('express');
const rateLimit = require('express-rate-limit');
const authController = require('./auth_controller.js');
const authMiddleware = require('../../middlewares/auth.js');
const validate = require('../../middlewares/validate.js');
const { loginRules, registerClientRules, requestAccessCompanyRules, activateCompanyRules } = require('./auth_rules.js');

const i18next = require('../../config/i18n.js');

const router = express.Router();

/*Limita cuántas peticiones puede hacer una misma IP en un periodo de tiempo
 para evitar ataques de fuerza bruta en el login*/

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // ventana de 15 minutos
  max: 10,                   // máximo 10 intentos por IP
  standardHeaders: true,     // devuelve info del límite en headers RateLimit-*
  legacyHeaders: false,      // desactiva headers X-RateLimit-* antiguos
  handler: (req, res) => {
    const lang = req.headers['accept-language'] || 'es';

    return res.status(429).json({
      ok: false,
      code: 'TOO_MANY_REQUESTS',
      message: i18next.t('auth.too_many_attempts', { lng: lang })
    });
  }
});

// Rutas de autenticación
router.post('/client/login', loginLimiter, validate(loginRules), authController.loginClient);
router.post('/company/login', loginLimiter, validate(loginRules), authController.loginCompany);
router.post('/driver/login', loginLimiter, validate(loginRules), authController.loginDriver);

router.get('/me', authMiddleware, authController.me);

// Rutas de registro
router.post('/client/register', validate(registerClientRules), authController.registerClient);

// Solicitud de acceso de empresa (público) y activación de cuenta tras aprobación del admin
router.post('/company/request-access', loginLimiter, validate(requestAccessCompanyRules), authController.requestAccessCompany);
router.post('/company/activate',       loginLimiter, validate(activateCompanyRules), authController.activateCompanyAccount);


module.exports = router;