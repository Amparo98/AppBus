async function generateLineCode(pool) {
  const { rows } = await pool.query(`
    SELECT code 
    FROM line
  `);

  const existingCodes = new Set(rows.map(row => row.code));
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  for (let number = 1; number <= 999; number++) {
    for (const letter of letters) {
      const code = `${String(number).padStart(3, '0')}${letter}`;

      if (!existingCodes.has(code)) {
        return code;
      }
    }
  }

  const error = new Error('NO_CODES_AVAILABLE');
  error.status = 500;
  error.code = 'NO_CODES_AVAILABLE';
  throw error;
}

async function generateDriverCode(pool) {
  const { rows } = await pool.query(`
    SELECT employee_number
    FROM driver
    WHERE employee_number IS NOT NULL
  `);

  const existingCodes = new Set(rows.map(row => row.employee_number));
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  for (let i = 0; i < letters.length; i++) {
    for (let j = 0; j < letters.length; j++) {
      for (let number = 1; number <= 99999; number++) {
        const code = `${letters[i]}${letters[j]}-${String(number).padStart(5, '0')}`;

        if (!existingCodes.has(code)) {
          return code;
        }
      }
    }
  }

  const error = new Error('NO_CODES_AVAILABLE');
  error.status = 500;
  error.code = 'NO_CODES_AVAILABLE';
  throw error;
}

module.exports = {
  generateLineCode,
  generateDriverCode
};