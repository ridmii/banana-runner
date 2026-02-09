import axios from 'axios';

const baseURL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
export const api = axios.create({
  baseURL,
  withCredentials: true,
});
