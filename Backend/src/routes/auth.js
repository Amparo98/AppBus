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

// Usuario login
router.post('/usuario/login', async (req, res) => {
  try {
    const { email, password } = req.body;

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

    const { rows } = await pool.query(query, [email]);
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

// Empresa login
router.post('/empresa/login', async (req, res) => {
  try {
    const { email, password } = req.body;

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

    const { rows } = await pool.query(query, [email]);
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