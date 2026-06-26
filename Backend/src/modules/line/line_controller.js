const lineService = require('./line_service.js');
const i18next = require('../../config/i18n.js');

function getLang(req) {
  return req.headers['accept-language'] || 'es';
}

async function getAllLine(req, res, next) {
  try {
    const lines = await lineService.getAllLine(req.user.id);
    res.status(200).json({
      ok: true,
      lines
    });
  } catch (error) {
    next(error);
  }
}

async function getLine(req, res, next) {
  try {
    const line = await lineService.getLine(req.params.code, req.user.id);

    res.status(200).json({
      ok: true,
      line
    });
  } catch (error) {
    next(error);
  }
}


async function addLine(req, res, next) {
  try {
    const lang = getLang(req);
    const line = await lineService.addLine(req.user.id, req.body);

    res.status(201).json({
      ok: true,
      message: i18next.t('line.created_successfully', { lng: lang }),
      line
    });
  } catch (error) {
    next(error);
  }
}

async function updateLine(req, res, next) {
  try {
    const lang = getLang(req);
    const line = await lineService.updateLine(req.params.code, req.user.id, req.body);

    res.status(200).json({
      ok: true,
      message: i18next.t('line.updated_successfully', { lng: lang }),
      line
    });
  } catch (error) {
    next(error);
  }
}

async function deleteLine(req, res, next) {
  try {
    const lang = getLang(req);
    const line = await lineService.deleteLine(req.params.code, req.user.id);
    res.status(200).json({ 
        ok: true, 
        message: i18next.t('line.deleted_successfully', { lng: lang }),
        line
    });
  } catch (error) {
    next(error);
  }
}

async function getActiveLinesPublic(req, res, next) {
    try {
    const positions = await positionService.getActiveLinesPublic();
    res.status(200).json({ ok: true, positions });
  } catch (error) {
    next(error);
  } 
}


module.exports = {
  getAllLine, 
  getLine, 
  addLine, 
  updateLine,
  deleteLine,
  getActiveLinesPublic
};