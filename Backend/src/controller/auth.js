const authService = require('../service/auth.js');

async function loginUsuario(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: 'Email y contraseña son obligatorios'
      });
    }

    const result = await authService.loginUsuario(email, password);

    return res.status(200).json({
      ok: true,
      message: 'Login correcto',
      ...result
    });
  } catch (error) {
    next(error);
  }
}

async function loginEmpresa(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: 'Email y contraseña son obligatorios'
      });
    }

    const result = await authService.loginEmpresa(email, password);

    return res.status(200).json({
      ok: true,
      message: 'Login correcto',
      ...result
    });
  } catch (error) {
    next(error);
  }
}

async function loginConductor(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: 'Email y contraseña son obligatorios'
      });
    }

    const result = await authService.loginConductor(email, password);
    return res.status(200).json({
      ok: true,
      message: 'Login correcto',
      ...result
    });
  } catch (error) {
    next(error);
  }
}

async function me(req, res) {
    return res.status(200).json({
        ok: true,
        user: req.user
    });
}

// Registro de usuario
async function registerUsuario(req, res, next) { 
  try {
      const result = await authService.registerUsuario(req.body);

      return res.status(201).json({
      ok: true,
      message: 'Usuario creado correctamente',
      user: result
      });
  } catch (error) {
      next(error);
  }
}

async function registerEmpresa(req, res, next) { 
  try {
      const result = await authService.registerEmpresa(req.body);

      return res.status(201).json({
          ok: true,
          message: 'Empresa creada correctamente',
          empresa: result
      });
  } catch (error) {
      next(error);
  }
}

module.exports = {
  loginUsuario,
  loginEmpresa,
  loginConductor,
  me,
  registerUsuario,
  registerEmpresa
};