import { api } from './api';

const FALLBACK_IMAGE = 'https://www.sanfoh.com/uob/banana/data/t64d1fda6c163888c5759dc3b79n99.png';

export const fetchBananaData = async () => {
  try {
    const { data } = await api.get('/api/banana', { params: { t: Date.now() + Math.random() } });
    return data;
  } catch (error) {
    console.error('Error fetching banana', error);
    throw error;
  }
};

export const getBananaImage = async () => {
  try {
    const data = await fetchBananaData();
    return data.image || FALLBACK_IMAGE;
  } catch (_) {
    return FALLBACK_IMAGE;
  }
};

export const getBananaQuestion = async () => {
  try {
    const data = await fetchBananaData();
    // API returns the numeric solution under different keys depending on version
    const solution = data.answer ?? data.solution ?? data.sol ?? null;
    return { image: data.image || FALLBACK_IMAGE, answer: solution };
  } catch (_) {
    return { image: FALLBACK_IMAGE, answer: null };
  }
};
