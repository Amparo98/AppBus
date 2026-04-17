const express = require('express');
const { pool } = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

const router = express.Router();

function generateToken(payload) {
  return jwt.sign(payload, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn
  });
}

/-------------USUARIO------------/
// Registro de usuario
router.post('/usuario/register', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    const nombreNormalized = nombre.trim().toLowerCase();
    const emailNormalized = email.trim().toLowerCase();

    if (!nombre || !email || !password) {
      return res.status(400).json({
        ok: false,
        message: 'Todos los campos son obligatorios'
      });
    }

    // Generar hash
    const passwordHash = await bcrypt.hash(password, 10);

    // Guardar en BD
    const query = `
      INSERT INTO usuario (nombre, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id_usuario, nombre, email
    `;

    const values = [nombreNormalized, emailNormalized, passwordHash];

    const { rows } = await pool.query(query, values);

    return res.status(201).json({
      ok: true,
      message: 'Usuario creado correctamente',
      user: rows[0]
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor'
    });
  }
});


// Usuario login
router.post('/usuario/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const emailNormalized = email.trim().toLowerCase();

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: 'Email y contraseña son obligatorios'
      });
    }

    const query = `
      SELECT id_usuario, nombre, email, password_hash
      FROM usuario
      WHERE email = $1
      LIMIT 1
    `;

    const { rows } = await pool.query(query, [emailNormalized]);
    const usuario = rows[0];

    if (!usuario) {
      return res.status(401).json({
        ok: false,
        message: 'Credenciales inválidas'
      });
    }

    const isValidPassword = await bcrypt.compare(password, usuario.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({
        ok: false,
        message: 'Credenciales inválidas'
      });
    }

    const token = generateToken({
      id: usuario.id_usuario,
      role: 'usuario'
    });

    return res.status(200).json({
      ok: true,
      message: 'Login correcto',
      token,
      user: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        role: 'usuario'
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor'
    });
  }
});

/------------EMPRESA------------/
/* Registro de empresa */
router.post('/empresa/register', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    const nombreNormalized = nombre.trim().toLowerCase();
    const emailNormalized = email.trim().toLowerCase();

    if (!nombre || !email || !password) {
      return res.status(400).json({
        ok: false,
        message: 'Todos los campos son obligatorios'
      });
    }

    // Generar hash
    const passwordHash = await bcrypt.hash(password, 10);

    // Guardar en BD
    const query = `
      INSERT INTO empresa (nombre, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id_empresa, nombre, email
    `;

    const values = [nombreNormalized, emailNormalized, passwordHash];

    const { rows } = await pool.query(query, values);

    return res.status(201).json({
      ok: true,
      message: 'Empresa creada correctamente',
      user: rows[0]
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor'
    });
  }
});

// Empresa login
router.post('/empresa/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const emailNormalized = email.trim().toLowerCase();
    
    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: 'Email y contraseña son obligatorios'
      });
    }

    const query = `
      SELECT id_empresa, nombre, email, password_hash
      FROM empresa
      WHERE email = $1
      LIMIT 1
    `;

    const { rows } = await pool.query(query, [emailNormalized]);
    const empresa = rows[0];

    if (!empresa) {
      return res.status(401).json({
        ok: false,
        message: 'Credenciales inválidas'
      });
    }

    const isValidPassword = await bcrypt.compare(password, empresa.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({
        ok: false,
        message: 'Credenciales inválidas'
      });
    }

    const token = generateToken({
      id: empresa.id_empresa,
      role: 'empresa'
    });

    return res.status(200).json({
      ok: true,
      message: 'Login correcto',
      token,
      user: {
        id: empresa.id_empresa,
        nombre: empresa.nombre,
        email: empresa.email,
        role: 'empresa'
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;