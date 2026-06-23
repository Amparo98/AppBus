import api from './api';

export async function loginCompany({ email, password }) {
  const { data } = await api.post('/auth/company/login', { email, password });
  return data;
}

export async function registerCompany({ name, email, password }) {
  const { data } = await api.post('/auth/company/register', {
    name,
    email,
    password,
  });
  return data;
}