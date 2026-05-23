const incidentService = require('./incident_service.js');
const i18next = require('../../config/i18n.js');

function getLang(req) {
  return req.headers['accept-language'] || 'es';
}

async function getAllIncident(req, res, next) {
  try {
    const incidents = await incidentService.getAllIncident(req.user.id);
    res.status(200).json({ ok: true, incidents });
  } catch (error) {
    next(error);
  }
}

async function getIncident(req, res, next) {
  try {
    const incident = await incidentService.getIncident(req.params.id_incident, req.user.id);
    res.status(200).json({ ok: true, incident });
  } catch (error) {
    next(error);
  }
}

async function addIncident(req, res, next) {
  try {
    const lang = getLang(req);
    const incident = await incidentService.addIncident(req.user.id, req.body);
    res.status(201).json({
      ok: true,
      message: i18next.t('incident.created_successfully', { lng: lang }),
      incident
    });
  } catch (error) {
    next(error);
  }
}

async function updateIncident(req, res, next) {
  try {
    const lang = getLang(req);
    const incident = await incidentService.updateIncident(req.params.id_incident, req.user.id, req.body);
    res.status(200).json({
      ok: true,
      message: i18next.t('incident.updated_successfully', { lng: lang }),
      incident
    });
  } catch (error) {
    next(error);
  }
}

async function deleteIncident(req, res, next) {
  try {
    const lang = getLang(req);
    await incidentService.deleteIncident(req.params.id_incident, req.user.id);
    res.status(200).json({
      ok: true,
      message: i18next.t('incident.delete_successfully', { lng: lang })
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getAllIncident, getIncident, addIncident, updateIncident, deleteIncident };