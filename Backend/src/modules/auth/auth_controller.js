const authService = require('./auth_service.js');
const i18next = require('../../config/i18n.js');

async function loginClient(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: i18next.t('auth.required_credentials')
      });
    }

    const result = await authService.loginClient(email, password);

    return res.status(200).json({
      ok: true,
      message: i18next.t('auth.login_success'),
      ...result
    });
  } catch (error) {
    next(error);
  }
}

async function loginCompany(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: i18next.t('auth.required_credentials')
      });
    }

    const result = await authService.loginCompany(email, password);

    return res.status(200).json({
      ok: true,
      message: i18next.t('auth.login_success'),
      ...result
    });
  } catch (error) {
    next(error);
  }
}

async function loginBusDriver(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: i18next.t('auth.required_credentials')
      });
    }

    const result = await authService.loginBusDriver(email, password);
    return res.status(200).json({
      ok: true,
      message: i18next.t('auth.login_success'),
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
async function registerClient(req, res, next) { 
  try {
      const result = await authService.registerClient(req.body);

      return res.status(201).json({
      ok: true,
      message: i18next.t('auth.client_created'),
      user: result
      });
  } catch (error) {
      next(error);
  }
}

async function registerCompany(req, res, next) { 
  try {
      const result = await authService.registerCompany(req.body);

      return res.status(201).json({
          ok: true,
          message: i18next.t('auth.company_created'),
          empresa: result
      });
  } catch (error) {
      next(error);
  }
}

module.exports = {
  loginClient,
  loginCompany,
  loginBusDriver,
  me,
  registerClient,
  registerCompany
};