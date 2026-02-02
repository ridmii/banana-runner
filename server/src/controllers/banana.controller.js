import { fetchBanana } from '../services/bananaAPI.js';

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
    return res.status(500).json({ message: 'Banana API error' });
  }
}

export async function getBananaTypes(req, res) {
  return res.json({ types: ['regular', 'golden', 'bunch'] });
}
