const add_ConductorRepository = require('../repositories/add_conductor.js');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS
  }
});

async function getConductores(empresa_id) {
  return await add_ConductorRepository.getConductoresByEmpresaId(empresa_id);
}

async function getConductoresPendientes(empresa_id) {
  return await add_ConductorRepository.getConductoresPendientes(empresa_id);
}

async function getConductor(id_conductor, empresa_id) {
  const conductor = await add_ConductorRepository.getConductorById(id_conductor, empresa_id);
  if (!conductor) {
    const error = new Error('Conductor no encontrado');
    error.status = 404;
    error.code = 'CONDUCTOR_NOT_FOUND';
    throw error;
  }
  return conductor;
}

async function agregarConductor(empresa_id, data) {
  const { nombre, apellido, dni, telefono } = data;
  const nombreNormalized = nombre.trim();
  const apellidoNormalized = apellido.trim();
  const emailGenerado = await generarEmail(nombreNormalized, apellidoNormalized);
  console.log('Email generado:', emailGenerado);

  const exists = await add_ConductorRepository.existsConductorByEmail(emailGenerado);
  if (exists) {
    const error = new Error('El email ya está registrado');
    error.status = 409;
    error.code = 'EMAIL_ALREADY_EXISTS';
    throw error;
  }

  const token_activacion = crypto.randomBytes(32).toString('hex');

  const conductor = await add_ConductorRepository.agregarConductor(
    empresa_id, nombreNormalized, apellidoNormalized,
    emailGenerado, dni, telefono, token_activacion
  );

  // Enviar email con Nodemailer
  const enlace = `${process.env.FRONTEND_URL}/activar-cuenta?token=${token_activacion}`;

  await transporter.sendMail({
    from: `AppBus <${process.env.GMAIL_USER}>`,
    to: emailGenerado,
    subject: 'Activa tu cuenta de conductor',
    html: `
      <h2>Bienvenido a AppBus, ${nombreNormalized}!</h2>
      <p>Tu empresa te ha dado de alta como conductor.</p>
      <p>Tu número de trabajador es: <strong>${conductor.num_trabajador}</strong></p>
      <p>Tu email de acceso es: <strong>${emailGenerado}</strong></p>
      <p>Haz clic en el siguiente enlace para establecer tu contraseña:</p>
      <a href="${enlace}">Activar cuenta</a>
      <p>Este enlace expirará en 24 horas.</p>
    `
  });

  return conductor;
}

async function generarEmail(nombre, apellido) {
  // Elimina tildes y caracteres especiales
  const normalizar = (str) => str
    .normalize('NFD')                    // descompone caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '')     // elimina los acentos
    .replace(/[^a-zA-Z0-9]/g, '')       // elimina cualquier otro carácter especial
    .toLowerCase();

  const primerNombre = normalizar(nombre.trim().split(' ')[0]);
  const primerApellido = normalizar(apellido.trim().split(' ')[0]);
  const base = `${primerNombre}.${primerApellido}`;

  let email = `${base}@appbus.com`;
  let contador = 1;

  while (await add_ConductorRepository.existsConductorByEmail(email)) {
    email = `${base}${contador}@appbus.com`;
    contador++;
  }

  return email; // pedro.garcia@appbus.com
}

async function activarCuenta(token, password) {
  const bcrypt = require('bcrypt');

  const conductor = await add_ConductorRepository.getConductorByToken(token);
  if (!conductor) {
    const error = new Error('Token inválido o expirado');
    error.status = 400;
    error.code = 'INVALID_TOKEN';
    throw error;
  }

  if (conductor.cuenta_activada) {
    const error = new Error('La cuenta ya está activada');
    error.status = 409;
    error.code = 'ALREADY_ACTIVATED';
    throw error;
  }

  const password_hash = await bcrypt.hash(password, 10);
  return await add_ConductorRepository.activarConductor(conductor.id_conductor, password_hash);
}

async function updateConductorEmpresa(id_conductor, empresa_id, data) {
  const conductor = await add_ConductorRepository.updateConductorEmpresa(id_conductor, empresa_id, data);
  if (!conductor) {
    const error = new Error('Conductor no encontrado');
    error.status = 404;
    error.code = 'CONDUCTOR_NOT_FOUND';
    throw error;
  }
  return conductor;
}

async function deleteConductor(id_conductor, empresa_id) {
  const conductor = await add_ConductorRepository.deleteConductor(id_conductor, empresa_id);
  if (!conductor) {
    const error = new Error('Conductor no encontrado');
    error.status = 404;
    error.code = 'CONDUCTOR_NOT_FOUND';
    throw error;
  }
}

module.exports = { agregarConductor, generarEmail, activarCuenta, getConductores, getConductoresPendientes, getConductor, updateConductorEmpresa, deleteConductor };