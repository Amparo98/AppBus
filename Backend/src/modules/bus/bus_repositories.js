const {pool} = require('../../config/db.js');

async function getBusByEmpresa(company_id) {
    const { rows } = await pool.query(
     `SELECT id_bus, license_plate, updated_at, statu, created_at
      FROM bus WHERE company_id = $1 ORDER BY created_at DESC`,
     [company_id]
   );
   return rows;
 }

async function getBusById(id_bus, company_id) {
    const { rows } = await pool.query(
     `SELECT id_bus, license_plate, updated_at, statu, created_at
      FROM bus WHERE id_bus = $1 AND company_id = $2`,
     [id_bus, company_id]
   );
   return rows[0] || null;
}

async function createBus(company_id, license_plate) {
    const { rows } = await pool.query(
     `INSERT INTO bus (company_id, license_plate)
      VALUES ($1, $2)
      RETURNING id_bus, license_plate, statu, created_at`,
     [company_id, license_plate]
   );
   return rows[0];
 }

async function updateBus(id_bus, company_id, fields) {
  const keys = Object.keys(fields);
  const values = Object.values(fields);
  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');

  const { rows } = await pool.query(
    `UPDATE bus SET ${setClause}
     WHERE id_bus = $${keys.length + 1} AND company_id = $${keys.length + 2}
     RETURNING id_bus, license_plate, statu, updated_at, created_at`,
    [...values, id_bus, company_id]
  );
  return rows[0] || null;
}

async function deleteBus(id_bus, company_id) {
    const { rows } = await pool.query(
     `DELETE FROM bus WHERE id_bus = $1 AND company_id = $2
      RETURNING id_bus`,
     [id_bus, company_id]
   );
   return rows[0] || null;
}

async function existsBusByLicensePlate(license_plate, company_id) {
  const { rows } = await pool.query(
    `SELECT EXISTS (
      SELECT 1 FROM bus WHERE license_plate = $1 AND company_id = $2
    ) AS exists`,
    [license_plate, company_id]
  );
  return rows[0].exists;
}

//cuando se empiece con la geolocalizacion, resvisar posteriormente
async function updateLastModified(id_bus) {
  const { rows } = await pool.query(
    `UPDATE bus SET updated_at = NOW()
     WHERE id_bus = $1
     RETURNING id_bus, updated_at`,
    [id_bus]
  );
  return rows[0] || null;
}

module.exports = {
    getBusByEmpresa,
    getBusById,
    createBus,
    updateBus,
    deleteBus, 
    existsBusByLicensePlate,
    updateLastModified
    
};
