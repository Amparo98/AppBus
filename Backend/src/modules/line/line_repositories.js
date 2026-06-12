const { pool } = require('../../config/db.js');
const { generateLineCode } = require('../../utils/codeDriver.js');

async function getLineByCompany(company_id) {
  const { rows } = await pool.query(
    `SELECT id_line, name_line, color, code, created_at
     FROM line WHERE company_id = $1 ORDER BY created_at DESC`,
    [company_id]
  );
  return rows;
}

async function getLineById(code, company_id) {
  const { rows } = await pool.query(
    `SELECT id_line, name_line, color, code, created_at
     FROM line WHERE code = $1 AND company_id = $2`,
    [code, company_id]
  );
  return rows[0] || null;
}

async function addLine(company_id, name_line, color) {
  const code = await generateLineCode(pool);
    const { rows } = await pool.query(
    `INSERT INTO line (company_id, name_line, color, code)
     VALUES ($1, $2, $3, $4)
     RETURNING id_line, name_line, color, code, created_at`,
    [company_id, name_line, color, code]
  );
  return rows[0];
}

async function updateLine(code, company_id, fields) {
  const keys = Object.keys(fields);
  const values = Object.values(fields);
  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');

  const { rows } = await pool.query(
    `UPDATE line SET ${setClause}
     WHERE code = $${keys.length + 1} AND company_id = $${keys.length + 2}
     RETURNING id_line, name_line, color, code, created_at`,
    [...values, code, company_id]
  );
  return rows[0] || null;
}

async function deleteLine(code, company_id) {
    const { rows } = await pool.query(
    `DELETE FROM line WHERE code = $1 AND company_id = $2
     RETURNING id_line`,
    [code, company_id]
  );
  return rows[0] || null;
}


// Para el usuario — líneas activas sin datos internos
async function getActiveLinesPublic() {
  const { rows } = await pool.query(
    `SELECT DISTINCT ON (l.id_line)
            l.id_line, l.code, l.name_line, l.color,
            ST_Y(bp.location_bus::geometry) AS latitude,
            ST_X(bp.location_bus::geometry) AS longitude,
            bp.dates AS last_update
     FROM services s
     JOIN line l ON l.id_line = s.line_id
     JOIN bus b ON b.id_bus = s.bus_id
     LEFT JOIN bus_position bp ON bp.bus_id = b.id_bus
     WHERE s.status = 'in_progress'
     AND b.status = 'operational'
     ORDER BY l.id_line, bp.dates DESC`
  );
  return rows;
}

module.exports = {
  getLineByCompany, 
  getLineById, 
  addLine, 
  updateLine, 
  deleteLine,
  getActiveLinesPublic

};