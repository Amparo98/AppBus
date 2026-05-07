const {pool} = require('../../config/db.js');

async function getBusByEmpresa(empresa_id) {
    const { rows } = await pool.query(
     `SELECT id_bus, matricula, ultima_actualizacion, en_servicio, created_at
      FROM bus WHERE empresa_id = $1 ORDER BY created_at DESC`,
     [empresa_id]
   );
   return rows;
 }

async function getBusById(id_bus, empresa_id) {
    const { rows } = await pool.query(
     `SELECT id_bus, matricula, ultima_actualizacion, en_servicio, created_at
      FROM bus WHERE id_bus = $1 AND empresa_id = $2`,
     [id_bus, empresa_id]
   );
   return rows[0] || null;
}

async function createBus(empresa_id, matricula) {
    const { rows } = await pool.query(
     `INSERT INTO bus (empresa_id, matricula)
      VALUES ($1, $2)
      RETURNING id_bus, matricula, en_servicio, created_at`,
     [empresa_id, matricula]
   );
   return rows[0];
 }

async function updateBus(id_bus, empresa_id, fields) {
  const keys = Object.keys(fields);
  const values = Object.values(fields);
  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');

  const { rows } = await pool.query(
    `UPDATE bus SET ${setClause}
     WHERE id_bus = $${keys.length + 1} AND empresa_id = $${keys.length + 2}
     RETURNING id_bus, matricula, en_servicio, ultima_actualizacion, created_at`,
    [...values, id_bus, empresa_id]
  );
  return rows[0] || null;
}

async function deleteBus(id_bus, empresa_id) {
    const { rows } = await pool.query(
     `DELETE FROM bus WHERE id_bus = $1 AND empresa_id = $2
      RETURNING id_bus`,
     [id_bus, empresa_id]
   );
   return rows[0] || null;
}

async function existsBusByMatricula(matricula, empresa_id) {
  const { rows } = await pool.query(
    `SELECT EXISTS (
      SELECT 1 FROM bus WHERE matricula = $1 AND empresa_id = $2
    ) AS exists`,
    [matricula, empresa_id]
  );
  return rows[0].exists;
}

//cuando se empiece con la geolocalizacion, resvisar posteriormente
async function actualizarUltimaActualizacion(id_bus) {
  const { rows } = await pool.query(
    `UPDATE bus SET ultima_actualizacion = NOW()
     WHERE id_bus = $1
     RETURNING id_bus, ultima_actualizacion`,
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
    existsBusByMatricula,
    actualizarUltimaActualizacion
    
};
