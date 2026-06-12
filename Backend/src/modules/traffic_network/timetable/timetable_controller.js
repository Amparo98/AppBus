const timeService = require('./timetable_service.js');

async function getTimetableByRoute(req, res, next) {
  try {
    const { day_type } = req.query;
    const timetable = await timeService.getTimetableByRoute(req.params.id_route, day_type);
    res.status(200).json({ ok: true, timetable });
  } catch (error) {
    next(error);
  }
}

async function getTimetableByStop(req, res, next) {
  try {
    const { day_type } = req.query;
    const timetable = await timeService.getTimetableByStop(req.params.id_stop, day_type);
    res.status(200).json({ ok: true, timetable });
  } catch (error) {
    next(error);
  }
}

async function addTimetable(req, res, next) {
  try {
    const timetable = await timeService.addTimetable(req.body);
    res.status(201).json({ ok: true, message: 'Timetable created correctly', timetable });
  } catch (error) {
    next(error);
  }
}

async function deleteTimetable(req, res, next) {
  try {
    await timeService.deleteTimetable(req.params.id_timetable);
    res.status(200).json({ ok: true, message: 'Timetable deleted correctly' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTimetableByRoute,
  getTimetableByStop,
  addTimetable,
  deleteTimetable
};