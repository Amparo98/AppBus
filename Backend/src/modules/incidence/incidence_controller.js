const incidenceService = require('./incidence_service.js');
const i18next = require('../../config/i18n.js');

function getLang(req) {
  return req.headers['accept-language'] || 'es';
}

async function getAllIncidence(req, res, next) {
  try {
    const incidence = await incidenceService.getAllIncidence(req.user.id);
    res.status(200).json({
      ok: true,
      incidence
    });
  } catch (error) {
    next(error);
  }
}

async function getIncidence(req, res, next) {
  try {
    const incidence = await incidenceService.getIncidence(req.params.id_incidence, req.user.id);

    res.status(200).json({
      ok: true,
      incidence
    });
  } catch (error) {
    next(error);
  }
}

async function addIncidence(req, res, next) {
  try {
    const lang = getLang(req);
    const incidence = await incidenceService.addIncidence(req.user.id, req.body);

    res.status(201).json({
      ok: true,
      message: i18next.t('incidence.created_successfully', { lng: lang }),
      incidence
    });
  } catch (error) {
    next(error);
  }
}

async function updateIncidence(req, res, next) {
  try {
    const lang = getLang(req);
    const incidence = await incidenceService.updateIncidence(req.params.id_incidence, req.user.id, req.body);

    res.status(200).json({
      ok: true,
      message: i18next.t('incidence.updated_successfully', { lng: lang }),
      incidence
    });
  } catch (error) {
    next(error);
  }
}

async function deleteIncidence(req, res, next) {
  try {
    const lang = getLang(req);

    const incidence = await incidenceService.deleteIncidence(req.params.id_incidence, req.user.id );

    res.status(200).json({
      ok: true,
      message: i18next.t('incidence.delete_successfully', { lng: lang }),
      incidence
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getAllIncidence, getIncidence, addIncidence, updateIncidence, deleteIncidence };