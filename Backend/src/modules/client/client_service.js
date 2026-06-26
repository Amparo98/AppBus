const clientRepository = require('./client_repositories');
const bcrypt = require('bcrypt');
const appError = require('../../utils/appError');

async function getProfile(client_id) {
  const client = await clientRepository.getClientById(client_id);
  if (!client) throw appError('CLIENT_NOT_FOUND', 404);
  return client;
}

async function updateProfile(client_id, data) {
  if (data.email) {
    const emailNormalized = data.email.trim().toLowerCase();
    const exists = await clientRepository.existsEmailForOtherClient(emailNormalized, client_id);
    if (exists) throw appError('EMAIL_ALREADY_EXISTS', 409);
    data.email = emailNormalized;
  }

  const client = await clientRepository.updateClient(client_id, data);
  if (!client) throw appError('CLIENT_NOT_FOUND', 404);
  return client;
}

async function updatePassword(client_id, current_password, new_password) {
  const client = await clientRepository.getClientById(client_id);
  if (!client) throw appError('CLIENT_NOT_FOUND', 404);

  const isValid = await bcrypt.compare(current_password, client.password_hash);
  if (!isValid) throw appError('INVALID_CREDENTIALS', 401);

  const password_hash = await bcrypt.hash(new_password, 10);
  await clientRepository.updatePassword(client_id, password_hash);
}

module.exports = { getProfile, updateProfile, updatePassword };