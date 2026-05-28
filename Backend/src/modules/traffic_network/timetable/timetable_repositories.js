const { pool } = require('../../../config/db');

async function getTimetableByRoute(route_id) {
  const { rows } = await pool.query(
    `SELECT t.id_timetable, t.route_id, t.stop_id,
            t.arrival_time, t.departure_time, t.day_type, t.created_at,
            s.name_stop, s.address_stop
     FROM timetable t
     JOIN stops s ON s.id_stop = t.stop_id
     WHERE t.route_id = $1
     ORDER BY t.arrival_time ASC`,
    [route_id]
  );
  return rows;
}

async function getTimetableByStop(stop_id) {
  const { rows } = await pool.query(
    `SELECT t.id_timetable, t.route_id, t.stop_id,
            t.arrival_time, t.departure_time, t.day_type, t.created_at,
            s.name_stop, s.address_stop
     FROM timetable t
     JOIN stops s ON s.id_stop = t.stop_id
     WHERE t.stop_id = $1
     ORDER BY t.arrival_time ASC`,
    [stop_id]
  );
  return rows; 
}

async function addTimetable(route_id, stop_id, arrival_time, departure_time, day_type) {
  const { rows } = await pool.query(
    `INSERT INTO timetable (route_id, stop_id, arrival_time, departure_time, day_type)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id_timetable, route_id, stop_id, arrival_time, departure_time, day_type, created_at`,
    [route_id, stop_id, arrival_time, departure_time, day_type]
  );
  return rows[0];
}

async function deleteTimetable(id_timetable) {
  const { rows } = await pool.query(
    `DELETE FROM timetable WHERE id_timetable = $1
     RETURNING id_timetable`,
    [id_timetable] 
  );
  return rows[0] || null;
}

module.exports = {
  getTimetableByRoute,
  getTimetableByStop,
  addTimetable,
  deleteTimetable
};