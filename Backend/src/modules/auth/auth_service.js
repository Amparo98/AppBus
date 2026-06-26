const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('../../config/env.js');
const authRepository = require('./auth_repositories.js');
const appError = require('../../utils/appError.js');

function generateToken(payload) {
  return jwt.sign(payload, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn
  });
}

async function loginClient(email, password) {
  const emailNormalized = email.trim().toLowerCase();
  const client = await authRepository.getClientByEmail(emailNormalized);

  if (!client) throw appError('INVALID_CREDENTIALS', 401);

  const isValidPassword = await bcrypt.compare(password, client.password_hash);

  if (!isValidPassword) throw appError('INVALID_CREDENTIALS', 401);

  const token = generateToken({
    id: client.id_client,
    role: 'Client'
  });

  return {
    token,
    user: {
      id: client.id_client,
      full_name: client.full_name,
      first_surname: client.first_surname,
      second_surname: client.second_surname,
      email: client.email,
      role: 'Client'
    }
  };
}

async function loginCompany(email, password) {
  const emailNormalized = email.trim().toLowerCase();
  const company = await authRepository.getCompanyByEmail(emailNormalized);

  if (!company) throw appError('INVALID_CREDENTIALS', 401);
  if (company.status === 'pending')  throw appError('ACCOUNT_PENDING_APPROVAL', 403);
  if (company.status === 'rejected') throw appError('ACCOUNT_REJECTED', 403);
  if (company.status === 'approved') throw appError('ACCOUNT_NOT_ACTIVATED', 403); // aprobada, sin password aún

  const isValidPassword = await bcrypt.compare(password, company.password_hash);
  if (!isValidPassword) throw appError('INVALID_CREDENTIALS', 401);

  const token = generateToken({ id: company.id_company, role: 'Company' });
  return {
    token,
    user: { 
      id: company.id_company, 
      name_company: company.name_company, 
      email: company.email, role: 'Company' }
  };
}


async function loginDriver(email, password) {
  const emailNormalized = email.trim().toLowerCase();
  const driver = await authRepository.getDriverByEmail(emailNormalized);

  if (!driver) throw appError('INVALID_CREDENTIALS', 401);

  // Cuenta no activada — aún no tiene contraseña
  if (!driver.is_account_activated) throw appError('ACCOUNT_NOT_ACTIVATED', 403);

  // Cuenta deshabilitada por la empresa
  if (!driver.is_active) throw appError('ACCOUNT_DISABLED', 403);

  const isValidPassword = await bcrypt.compare(password, driver.password_hash);
  if (!isValidPassword) throw appError('INVALID_CREDENTIALS', 401);

  const token = generateToken({ id: driver.id_driver, role: 'Driver' });
  return {
    token,
    user: {
      id: driver.id_driver,
      full_name: driver.full_name,
      first_surname: driver.first_surname,
      second_surname: driver.second_surname,
      email: driver.email,
      employee_number: driver.employee_number,
      role: 'Driver'
    }
  };
}

//registro
async function registerClient(data) {
  const { name, first_surname, second_surname, email, password } = data;

  if (!name || !first_surname || !email || !password) throw appError('REQUIRED_FIELDS', 400);

  const fullName = name.trim();
  const firstSurname = first_surname.trim();
  const secondSurname = second_surname ? second_surname.trim() : null;
  const emailNormalized = email.trim().toLowerCase();

  const exists = await authRepository.existsClientByEmail(emailNormalized);

  if (exists) throw appError('EMAIL_ALREADY_EXISTS', 409);

  const passwordHash = await bcrypt.hash(password, 10);

  return await authRepository.createClient(
    fullName,
    firstSurname,
    secondSurname,
    emailNormalized,
    passwordHash
  );
}

async function requestAccessCompany(data) {
  const { name, email } = data;
  if (!name || !email) throw appError('REQUIRED_FIELDS', 400);

  const nameCompany = name.trim();
  const emailNormalized = email.trim().toLowerCase();

  const exists = await authRepository.existsCompanyByEmail(emailNormalized);
  if (exists) throw appError('EMAIL_ALREADY_EXISTS', 409);

  return await authRepository.createCompany(nameCompany, emailNormalized);
}

async function activateCompanyAccount(token, password) {
  const company = await authRepository.getCompanyByToken(token);
  if (!company) throw appError('INVALID_TOKEN', 400);
  if (company.status === 'active') throw appError('ALREADY_ACTIVATED', 409);

  const password_hash = await bcrypt.hash(password, 10);
  const activated = await authRepository.activateCompany(company.id_company, password_hash);
  if (!activated) throw appError('INVALID_TOKEN', 400); // por si el status no era 'approved'
  return activated;
}

module.exports = {
  loginClient,
  loginCompany,
  loginDriver, 
  registerClient,
  requestAccessCompany,
  activateCompanyAccount
};
