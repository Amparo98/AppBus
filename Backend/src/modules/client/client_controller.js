const clientService = require('./client_service.js');
const i18next = require('../../config/i18n.js');

function getLang(req) {
  return req.headers['accept-language'] || 'es';
}

async function getProfile(req, res, next) {
  try {
    const client = await clientService.getProfile(req.user.id);
    res.status(200).json({ ok: true, client });
  } catch (error) {
    next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const lang = getLang(req);
    const client = await clientService.updateProfile(req.user.id, req.body);
    res.status(200).json({ 
      ok: true, 
      message: i18next.t('client.updated_successfully', { lng: lang }),
      client 
    });
  } catch (error) {
    next(error);
  }
}

async function updatePassword(req, res, next) {
  try {
    const lang = getLang(req);
    const { current_password, new_password } = req.body;
    await clientService.updatePassword(req.user.id, current_password, new_password);
    res.status(200).json({ 
      ok: true, 
      message: i18next.t('client.password_updated', { lng: lang })
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getProfile, updateProfile, updatePassword };