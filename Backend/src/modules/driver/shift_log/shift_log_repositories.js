const { pool } = require('../../../config/db.js');

// Uso interno — verificar si hay jornada abierta
async function getOpenShift(driver_id) {
  const { rows } = await pool.query(
    `SELECT id_shift_log, driver_id, start_time, end_time, created_at
     FROM shift_log 
     WHERE driver_id = $1 AND end_time IS NULL
     LIMIT 1`,
    [driver_id]
  );
  return rows[0] || null;
}

// Empresa — ver todos los conductores fichados ahora mismo
async function getActiveShifts(company_id) {
  const { rows } = await pool.query(
    `SELECT sl.id_shift_log, sl.driver_id, sl.start_time, sl.created_at,
            d.full_name, d.first_surname, d.employee_number
     FROM shift_log sl
     JOIN driver d ON d.id_driver = sl.driver_id
     WHERE d.company_id = $1 AND sl.end_time IS NULL
     ORDER BY sl.start_time ASC`,
    [company_id]
  );
  return rows;
}

// Historial de fichajes de un conductor
async function getShiftsByDriver(driver_id) {
  const { rows } = await pool.query(
    `SELECT id_shift_log, driver_id, start_time, end_time, created_at
     FROM shift_log 
     WHERE driver_id = $1 
     ORDER BY created_at DESC`,
    [driver_id]
  );
  return rows; // ✅ devuelve todos
}

async function startShift(driver_id) {
  const { rows } = await pool.query(
    `INSERT INTO shift_log (driver_id, start_time)
     VALUES ($1, NOW())
     RETURNING id_shift_log, driver_id, start_time, created_at`,
    [driver_id]
  );
  return rows[0];
}

async function endShift(driver_id) {
  const { rows } = await pool.query(
    `UPDATE shift_log SET end_time = NOW()
     WHERE driver_id = $1 AND end_time IS NULL
     RETURNING id_shift_log, driver_id, start_time, end_time, created_at`,
    [driver_id]
  );
  return rows[0] || null;
}

module.exports = {
  getOpenShift,
  getActiveShifts,
  getShiftsByDriver,
  startShift,
  endShift
};