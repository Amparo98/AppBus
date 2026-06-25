const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const env = require('../../config/env.js');
const adminRepository = require('./admin_repositories.js');
const appError = require('../../utils/appError.js');
const i18next = require('../../config/i18n.js');

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: Number(process.env.MAILTRAP_PORT),
  auth: { user: process.env.MAILTRAP_USER, pass: process.env.MAILTRAP_PASS }
});

function generateToken(payload) {
  return jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expiresIn });
}

async function loginAdmin(email, password) {
  const emailNormalized = email.trim().toLowerCase();
  const admin = await adminRepository.getAdminByEmail(emailNormalized);
  if (!admin) throw appError('INVALID_CREDENTIALS', 401);

  const isValidPassword = await bcrypt.compare(password, admin.password_hash);
  if (!isValidPassword) throw appError('INVALID_CREDENTIALS', 401);

  const token = generateToken({ id: admin.id_admin, role: 'Admin' });
  return { token, user: { id: admin.id_admin, email: admin.email, role: 'Admin' } };
}

async function getPendingCompanies() {
  return await adminRepository.getPendingCompanies();
}

async function approveCompany(id_company, lang = 'es') {
  const activationToken = crypto.randomBytes(32).toString('hex');
  const company = await adminRepository.approveCompany(id_company, activationToken);
  if (!company) throw appError('COMPANY_NOT_FOUND', 404);

  const activationLink = `${process.env.FRONTEND_URL}/activate-account?token=${activationToken}`;

  await transporter.sendMail({
    from: `TuApp <${process.env.MAILTRAP_USER}>`,
    to: company.email,
    subject: i18next.t('company.activateAccountSubject', { lng: lang }),
    html: `
      <h2>${i18next.t('company.welcomeMessage', { lng: lang, name: company.name_company })}</h2>
      <p>${i18next.t('company.requestApproved', { lng: lang })}</p>
      <a href="${activationLink}">${i18next.t('company.activateAccountButton', { lng: lang })}</a>
      <p>${i18next.t('company.linkExpires', { lng: lang })}</p>
    `
  });

  return company;
}

async function rejectCompany(id_company) {
  const company = await adminRepository.rejectCompany(id_company);
  if (!company) throw appError('COMPANY_NOT_FOUND', 404);
  return company;
}

module.exports = { loginAdmin, getPendingCompanies, approveCompany, rejectCompany };