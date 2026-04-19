async function generarCodigoLinea(pool) {
  // Obtiene todos los códigos existentes
  const { rows } = await pool.query(`SELECT codigo FROM linea`);
  const existentes = new Set(rows.map(r => r.codigo));

  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  for (let num = 1; num <= 999; num++) {
    for (let letra of letras) {
      const codigo = `${String(num).padStart(3, '0')}${letra}`;
      if (!existentes.has(codigo)) {
        return codigo; // devuelve el primero disponible
      }
    }
  }

  const error = new Error('No hay códigos disponibles');
  error.status = 500;
  error.code = 'NO_CODES_AVAILABLE';
  throw error;
}

module.exports = { generarCodigoLinea };