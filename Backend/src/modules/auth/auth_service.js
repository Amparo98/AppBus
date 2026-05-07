const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('../../config/env.js');
const authRepository = require('./auth_repositories.js');

function generateToken(payload) {
  return jwt.sign(payload, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn
  });
}

async function loginClient(email, password) {
  const emailNormalized = email.trim().toLowerCase();
  const client = await authRepository.getClientByEmail(emailNormalized);

  if (!client) {
    const error = new Error('Credenciales inválidas');
    error.status = 401;
    error.code = 'INVALID_CREDENTIALS';  
    throw error;
  }

  const isValidPassword = await bcrypt.compare(password, client.password_hash);

  if (!isValidPassword) {
    const error = new Error('Credenciales inválidas');
    error.status = 401;
    error.code = 'INVALID_CREDENTIALS'; 
    throw error;
  }

  const token = generateToken({
    id: client.id_client,
    role: 'Client'
  });

  return {
    token,
    user: {
      id: client.id_client,
      nombre: client.nombre,
      apellido: client.apellido,
      email: client.email,
      role: 'Client'
    }
  };
}

async function loginCompany(email, password) {

  const emailNormalized = email.trim().toLowerCase();
  const company = await authRepository.getCompanyByEmail(emailNormalized);

  if (!company) {
    const error = new Error('Credenciales inválidas');
    error.status = 401;
    error.code = 'INVALID_CREDENTIALS';  
    throw error;
  }

  const isValidPassword = await bcrypt.compare(password, company.password_hash);

  if (!isValidPassword) {
    const error = new Error('Credenciales inválidas');
    error.status = 401;
    error.code = 'INVALID_CREDENTIALS'; 
    throw error;
  }

  const token = generateToken({
    id: company.id_company,
    role: 'Company'
  });

  return {
    token,
    user: {
      id: company.id_company,
      nombre: company.nombre,
      email: company.email,
      role: 'Company'
    }
  };
}

async function loginBusDriver(email, password) {
  const emailNormalized = email.trim().toLowerCase();
  const busDriver = await authRepository.getBusDriverByEmail(emailNormalized);

  if (!busDriver) {
    const error = new Error('Credenciales inválidas');
    error.status = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  // Cuenta no activada — aún no tiene contraseña
  if (!busDriver.cuenta_activada) {
    const error = new Error('Debes activar tu cuenta primero, revisa tu email');
    error.status = 403;
    error.code = 'ACCOUNT_NOT_ACTIVATED';
    throw error;
  }

  // Cuenta deshabilitada por la empresa
  if (!busDriver.activo) {
    const error = new Error('Tu cuenta está deshabilitada, contacta con tu empresa');
    error.status = 403;
    error.code = 'ACCOUNT_DISABLED';
    throw error;
  }

  const isValidPassword = await bcrypt.compare(password, busDriver.password_hash);
  if (!isValidPassword) {
    const error = new Error('Credenciales inválidas');
    error.status = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  const token = generateToken({ id: busDriver.id_bus_driver, role: 'bus_driver' });
  return {
    token,
    user: {
      id: busDriver.id_bus_driver,
      nombre: busDriver.nombre,
      apellido: busDriver.apellido,
      email: busDriver.email,
      num_trabajador: busDriver.num_trabajador,
      role: 'bus_driver'
    }
  };
}

//registro
async function registerClient(data) {
  const { nombre, apellidos, email, password } = data;

  if (!nombre  || !email || !password) {
    const error = new Error('Nombre, email y contraseña son obligatorios');
    error.status = 400;
    throw error;
  }

  const nombreNormalized = nombre.trim();
  const apellidosNormalized = apellidos ? apellidos.trim() : null;
  const emailNormalized = email.trim().toLowerCase();

  const exists = await authRepository.existsClient(emailNormalized);
  if (exists) {
    const error = new Error('El email ya está registrado');
    error.status = 409;
    throw error;
  }
    
  // Generar hash
  const passwordHash = await bcrypt.hash(password, 10);

  return await authRepository.createClient(
    nombreNormalized, 
    apellidosNormalized,  
    emailNormalized, 
    passwordHash);
}

async function registerCompany(data) {
  const { nombre, email, password } = data;

  if (!nombre || !email || !password) {
    const error = new Error('Todos los campos son obligatorios');
    error.status = 400;
    throw error;
  }

  const nombreNormalized = nombre.trim();
  const emailNormalized = email.trim().toLowerCase();
  const exists = await authRepository.existsCompanyByEmail(emailNormalized);

  if (exists) {
    const error = new Error('El email ya está registrado');
    error.status = 409;
    throw error;
  }
    
  // Generar hash
  const passwordHash = await bcrypt.hash(password, 10);

  return await authRepository.createCompany(
    nombreNormalized, 
    emailNormalized, 
    passwordHash);
}

module.exports = {
  loginClient,
  loginCompany,
  loginBusDriver, 
  registerClient,
  registerCompany
};