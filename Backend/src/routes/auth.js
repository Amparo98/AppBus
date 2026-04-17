const express = require('express');
const authController = require('../controller/auth.js');
const authMiddleware = require('../middlewares/auth.js');

const router = express.Router();

// Rutas de autenticación
router.post('/usuario/login', authController.loginUsuario);
router.post('/empresa/login', authController.loginEmpresa);
router.get('/me', authMiddleware, authController.me);

// Rutas de registro
router.post('/usuario/register', authController.registerUsuario);
router.post('/empresa/register', authController.registerEmpresa);

module.exports = router;