const authService = require('./auth_service.js');
const i18next = require('../../config/i18n.js');

//Opcional, esto se utiliza para el cambio de idiomas segun el header que estemos utilizando 
function getLang(req) {
  return req.headers['accept-language'] || 'es';
}

async function loginClient(req, res, next) {
  try {
    const lang = getLang(req);
    const { email, password } = req.body;
    const result = await authService.loginClient(email, password);

    return res.status(200).json({
      ok: true,
      message: i18next.t('auth.login_success', { lng: lang }),
      ...result
    });
  } catch (error) {
    next(error);
  }
}

async function loginCompany(req, res, next) {
  try {
    const lang = getLang(req);
    const { email, password } = req.body;
    const result = await authService.loginCompany(email, password);

    return res.status(200).json({
      ok: true,
      message: i18next.t('auth.login_success', { lng: lang }),
      ...result
    });
  } catch (error) {
    next(error);
  }
}

async function loginDriver(req, res, next) {
  try {
    const lang = getLang(req);
    const { email, password } = req.body;
    const result = await authService.loginDriver(email, password);
    return res.status(200).json({
      ok: true,
      message: i18next.t('auth.login_success', { lng: lang }),
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
      const lang = getLang(req);
      const result = await authService.registerClient(req.body);

      return res.status(201).json({
      ok: true,
      message: i18next.t('auth.client_created', { lng: lang }),
      client: result
      });
  } catch (error) {
      next(error);
  }
}

async function registerCompany(req, res, next) { 
  try {
      const lang = getLang(req);
      const result = await authService.registerCompany(req.body);

      return res.status(201).json({
          ok: true,
          message: i18next.t('auth.company_created', { lng: lang }),
          company: result
      });
  } catch (error) {
      next(error);
  }
}

async function requestAccessCompany(req, res, next) {
  try {
    const lang = getLang(req);
    const result = await authService.requestAccessCompany(req.body);
    return res.status(201).json({ 
      ok: true, 
      message: i18next.t('auth.request_sent' ,{ lng: lang }), 
      company: result 
    });
  } catch (error) { next(error); }
}

async function activateCompanyAccount(req, res, next) {
  try {
    const lang = getLang(req);
    const { token, password } = req.body;
    const result = await authService.activateCompanyAccount(token, password);
    return res.status(200).json({ 
      ok: true, 
      message: i18next.t('auth.account_activated', { lng: lang }),
      company: result 
    });
  } catch (error) { next(error); }
}

module.exports = {
  loginClient,
  loginCompany,
  loginDriver,
  me,
  registerClient,
  registerCompany,
  requestAccessCompany,
  activateCompanyAccount
};