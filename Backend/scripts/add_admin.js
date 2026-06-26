require('dotenv').config();
const { pool } = require('../src/config/db'); 
const bcrypt = require('bcrypt');

async function addAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('Faltan ADMIN_EMAIL o ADMIN_PASSWORD en el .env');
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await pool.query(
    `INSERT INTO admin (email, password_hash) VALUES ($1, $2)`,
    [email, passwordHash]
  );
  console.log(`Admin creado: ${email}`);
  process.exit(0);
}

addAdmin();

//Como en este momento solo tendremos un admin, lo hacemos esto para no mostarr de forma publica las credenciales sino que en el.env, con gitignore ya no son tan visibles al publico 