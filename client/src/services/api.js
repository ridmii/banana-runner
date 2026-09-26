import axios from 'axios';

// Use relative path '/api' in production (Vercel) to hit the serverless functions, or localhost in dev
const baseURL = import.meta.env.PROD ? '' : (import.meta.env.VITE_SERVER_URL || 'http://localhost:5000');
export const api = axios.create({
  baseURL,
  withCredentials: true,
});
