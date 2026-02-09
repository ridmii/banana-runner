import { fetchBanana } from '../services/bananaAPI.js';

const FALLBACK_IMAGE = 'https://www.sanfoh.com/uob/banana/data/t64d1fda6c163888c5759dc3b79n99.png';

export async function getBanana(req, res) {
  try {
    const data = await fetchBanana();
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
      'Surrogate-Control': 'no-store',
    });
    // Normalize response shape to always provide { image, answer }
    const image = data.image || data.link || data.question || data.img || null;
    const rawAnswer = data.answer ?? data.solution ?? data.sol ?? null;
    const answer = rawAnswer != null ? Number(String(rawAnswer).trim()) : null;
    return res.json({ image, answer });
  } catch (e) {
    // Return a graceful fallback to avoid client errors and allow gameplay
    return res.json({ image: FALLBACK_IMAGE, answer: null });
  }
}

export async function getBananaTypes(req, res) {
  return res.json({ types: ['regular', 'golden', 'bunch'] });
}
