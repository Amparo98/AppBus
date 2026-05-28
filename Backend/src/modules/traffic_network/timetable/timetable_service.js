const timeRepository = require('./timetable_repositories.js');
const appError = require('../../utils/appError.js');

async function getTimetableByRoute(route_id) {
  const timetable = await timeRepository.getTimetableByRoute(route_id);
  if (!timetable || timetable.length === 0) throw appError('TIMETABLE_NOT_FOUND', 404);
  return timetable;
}

async function getTimetableByStop(stop_id) {
  const timetable = await timeRepository.getTimetableByStop(stop_id);
  if (!timetable || timetable.length === 0) throw appError('TIMETABLE_NOT_FOUND', 404);
  return timetable;
}

async function addTimetable(data) {
  const { route_id, stop_id, arrival_time, departure_time, day_type } = data;
  return await timeRepository.addTimetable(route_id, stop_id, arrival_time, departure_time, day_type);
}

async function deleteTimetable(id_timetable) {
  const timetable = await timeRepository.deleteTimetable(id_timetable);
  if (!timetable) throw appError('TIMETABLE_NOT_FOUND', 404);
}

module.exports = {
  getTimetableByRoute,
  getTimetableByStop,
  addTimetable,
  deleteTimetable
};