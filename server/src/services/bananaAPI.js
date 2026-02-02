import axios from 'axios';
const BANANA_API_URL = 'https://marcconrad.com/uob/banana/api.php';

export async function fetchBanana() {
  const { data } = await axios.get(BANANA_API_URL, {
    params: { out: 'json', base64: 'no', _: Date.now() + Math.random() },
    headers: { 'Cache-Control': 'no-cache' },
  });
  return data;
}
