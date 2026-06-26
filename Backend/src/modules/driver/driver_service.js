const driverRepository = require('./driver_repositories');
const nodemailer = require('nodemailer');

const crypto = require('crypto');
const bcrypt = require('bcrypt');

const appError = require('../../utils/appError.js');
const i18next = require('../../config/i18n.js');

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: Number(process.env.MAILTRAP_PORT),
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
});

async function getAllDriversByCompany(company_id) {
  return await driverRepository.getDriverByCompany(company_id);
}

async function getDriverPending(company_id) {
  return await driverRepository.getPendingDrivers(company_id);
}
 
async function getDriverById(id_driver, company_id) {
  const driver = await driverRepository.getDriverById(id_driver, company_id);
  if (!driver) throw appError('DRIVER_NOT_FOUND', 404);
  return driver;
}

async function addDriver(company_id, data, lang = 'es') {
  const {name, first_surname, second_surname, dni, phone_number, personal_email } = data;

  const company = await driverRepository.getCompanyById(company_id);
  if (!company) throw appError('COMPANY_NOT_FOUND', 404);

  const companyName = company.name_company;

  const nameNormalized = name.trim();
  const firstSurname = first_surname.trim();
  const secondSurname = second_surname ? second_surname.trim() : null;
  const personalEmail = personal_email.trim().toLowerCase();

  const companyEmail = await generateEmail(nameNormalized, firstSurname, companyName );

  const exists = await driverRepository.existsDriverByEmail(companyEmail);
  if (exists) throw appError('EMAIL_ALREADY_EXISTS', 409);

  const activationToken = crypto.randomBytes(32).toString('hex');

  const driver = await driverRepository.addDriver(company_id, nameNormalized, firstSurname, secondSurname, personalEmail,
    companyEmail, dni, phone_number, activationToken);

  const activationLink = `${process.env.FRONTEND_URL}/activate-account?token=${activationToken}&role=driver`;

  await transporter.sendMail({
    from: `${companyName} <${process.env.GMAIL_USER}>`,
    to: personalEmail,
    subject: i18next.t('driver.activateAccountSubject', { lng: lang }),
    html: `
      <h2>${i18next.t('driver.welcomeMessage', {
        lng: lang,
        companyName,
        name: nameNormalized
      })}</h2>

      <p>${i18next.t('driver.driverRegistered', { lng: lang })}</p>

      <p>
        ${i18next.t('driver.workerNumber', { lng: lang })}
        <strong>${driver.employee_number}</strong>
      </p>

      <p>
        ${i18next.t('driver.accessEmail', { lng: lang })}
        <strong>${companyEmail}</strong>
      </p>

      <p>${i18next.t('driver.setPassword', { lng: lang })}</p>

      <a href="${activationLink}">
        ${i18next.t('driver.activateAccountButton', { lng: lang })}
      </a>

      <p>${i18next.t('driver.linkExpires', { lng: lang })}</p>
    `
  });

  return driver;
}

async function generateEmail(name, first_surname, companyName) {
  // Elimina tildes y caracteres especiales
  const normalizar = (str) => str
    .normalize('NFD')                    // descompone caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '')     // elimina los acentos
    .replace(/[^a-zA-Z0-9]/g, '')       // elimina cualquier otro carácter especial
    .toLowerCase();

  const firstName = normalizar(name.trim().split(' ')[0]);
  const firstSurname = normalizar(first_surname.trim().split(' ')[0]);
  const companySlug = normalizar(companyName);

  const base = `${firstName}.${firstSurname}`;

  let companyEmail  = `${base}@${companySlug}.com`;
  let counter = 1;

  while (await driverRepository.existsDriverByEmail(companyEmail )) {
    companyEmail  = `${base}${counter}@${companySlug}.com`;
    counter++;
  }

  return companyEmail ; // pedro.garcia@appbus.com
}

async function activeAccount(activationToken, password) {
  const driver = await driverRepository.getDriverByToken(activationToken);
  if (!driver) throw appError('INVALID_TOKEN', 400); 

  if (driver.is_account_activated) throw appError('ALREADY_ACTIVATED', 409);

  const password_hash = await bcrypt.hash(password, 10);
  return await driverRepository.activateDriver(driver.id_driver, password_hash);
}

// driver_service.js
async function updateDriverByCompany(id_driver, company_id, data) {  
  const driver = await driverRepository.updateDriverByCompany(id_driver, company_id, data);
  console.log('UPDATE resultado:', driver);
  
  if (!driver) throw appError('DRIVER_NOT_FOUND', 404);  
  return driver;
}

async function deleteDriver(id_driver, company_id) {
  const driver = await driverRepository.deleteDriver(id_driver, company_id);
  if (!driver) throw appError('DRIVER_NOT_FOUND', 404);  
  return driver;
}

module.exports = { 
  getAllDriversByCompany,
  getDriverPending,
  getDriverById,
  addDriver,
  generateEmail,
  activeAccount,
  updateDriverByCompany,
  deleteDriver
 };