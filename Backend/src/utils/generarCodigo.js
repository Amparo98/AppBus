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


async function generarCodigoConductor(pool) {
  // Obtiene todos los códigos existentes
  const { rows } = await pool.query(`SELECT num_trabajador FROM conductor`);
  const existentes = new Set(rows.map(r => r.num_trabajador));

  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  for (let i = 0; i < letras.length; i++) {
    for (let j = 0; j < letras.length; j++) {
      for (let num = 1; num <= 99999; num++) {
        const codigo = `${letras[i]}${letras[j]}-${String(num).padStart(5, '0')}`;
        if (!existentes.has(codigo)) {
          return codigo;
        }
      }
    }
  }
  const error = new Error('No hay códigos disponibles');
  error.status = 500;
  error.code = 'NO_CODES_AVAILABLE';
  throw error;
}


module.exports = { generarCodigoLinea, generarCodigoConductor };