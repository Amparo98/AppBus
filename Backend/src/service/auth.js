const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const authRepository = require('../repositories/consultas.js');

function generateToken(payload) {
  return jwt.sign(payload, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn
  });
}

async function loginUsuario(email, password) {
  const emailNormalized = email.trim().toLowerCase();
  const usuario = await authRepository.getUsuarioByEmail(emailNormalized);

  if (!usuario) {
    const error = new Error('Credenciales inválidas');
    error.status = 401;
    error.code = 'INVALID_CREDENTIALS';  
    throw error;
  }

  const isValidPassword = await bcrypt.compare(password, usuario.password_hash);

  if (!isValidPassword) {
    const error = new Error('Credenciales inválidas');
    error.status = 401;
    error.code = 'INVALID_CREDENTIALS'; 
    throw error;
  }

  const token = generateToken({
    id: usuario.id_usuario,
    role: 'usuario'
  });

  return {
    token,
    user: {
      id: usuario.id_usuario,
      nombre: usuario.nombre,
      email: usuario.email,
      role: 'usuario'
    }
  };
}

async function loginEmpresa(email, password) {

  const emailNormalized = email.trim().toLowerCase();
  const empresa = await authRepository.getEmpresaByEmail(emailNormalized);

  if (!empresa) {
    const error = new Error('Credenciales inválidas');
    error.status = 401;
    error.code = 'INVALID_CREDENTIALS';  
    throw error;
  }

  const isValidPassword = await bcrypt.compare(password, empresa.password_hash);

  if (!isValidPassword) {
    const error = new Error('Credenciales inválidas');
    error.status = 401;
    error.code = 'INVALID_CREDENTIALS'; 
    throw error;
  }

  const token = generateToken({
    id: empresa.id_empresa,
    role: 'empresa'
  });

  return {
    token,
    user: {
      id: empresa.id_empresa,
      nombre: empresa.nombre,
      email: empresa.email,
      role: 'empresa'
    }
  };
}

//registro
async function registerUsuario(data) {
  const { nombre, email, password } = data;

  if (!nombre || !email || !password) {
    const error = new Error('Todos los campos son obligatorios');
    error.status = 400;
    throw error;
  }

  const nombreNormalized = nombre.trim();
  const emailNormalized = email.trim().toLowerCase();

  const exists = await authRepository.existsUsuarioByEmail(emailNormalized);
  if (exists) {
    const error = new Error('El email ya está registrado');
    error.status = 409;
    throw error;
  }
    
  // Generar hash
  const passwordHash = await bcrypt.hash(password, 10);

  return await authRepository.createUsuario(
    nombreNormalized, 
    emailNormalized, 
    passwordHash);
}

async function registerEmpresa(data) {
  const { nombre, email, password } = data;

  if (!nombre || !email || !password) {
    const error = new Error('Todos los campos son obligatorios');
    error.status = 400;
    throw error;
  }

  const nombreNormalized = nombre.trim();
  const emailNormalized = email.trim().toLowerCase();
  const exists = await authRepository.existsEmpresaByEmail(emailNormalized);

  if (exists) {
    const error = new Error('El email ya está registrado');
    error.status = 409;
    throw error;
  }
    
  // Generar hash
  const passwordHash = await bcrypt.hash(password, 10);

  return await authRepository.createEmpresa(
    nombreNormalized, 
    emailNormalized, 
    passwordHash);
}

module.exports = {
  loginUsuario,
  loginEmpresa,
  registerUsuario,
  registerEmpresa
};