import { api } from './api';

export async function register(payload) {
  const { data } = await api.post('/api/auth/register', payload);
  return data;
}

export async function login(payload) {
  const { data } = await api.post('/api/auth/login', payload);
  return data;
}

export async function logout() {
  const { data } = await api.post('/api/auth/logout');
  return data;
}

export async function me() {
  const { data } = await api.get('/api/auth/me');
  return data;
}

export async function updateProfile(payload) {
  const { data } = await api.put('/api/auth/profile', payload);
  return data;
}

export async function changePassword(payload) {
  const { data } = await api.put('/api/auth/password', payload);
  return data;
}

export async function getAvatarOptions() {
  const { data } = await api.get('/api/auth/avatars');
  return data;
}
