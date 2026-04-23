const express = require('express');
const rateLimit = require('express-rate-limit');
const authController = require('../controller/auth.js');
const authMiddleware = require('../middlewares/auth.js');
const validate = require('../middlewares/validate.js');
const { loginSchema, registerUsuarioSchema, registerEmpresaSchema } = require('../schemas/auth.js');

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
router.post('/usuario/login', loginLimiter, validate(loginSchema), authController.loginUsuario);
router.post('/empresa/login', loginLimiter, validate(loginSchema), authController.loginEmpresa);
router.post('/conductor/login', loginLimiter, validate(loginSchema), authController.loginConductor);
router.get('/me', authMiddleware, authController.me);

// Rutas de registro
router.post('/usuario/register', validate(registerUsuarioSchema), authController.registerUsuario);
router.post('/empresa/register', validate(registerEmpresaSchema), authController.registerEmpresa);

module.exports = router;