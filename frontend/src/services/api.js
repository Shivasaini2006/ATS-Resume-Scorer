// API helper placeholder
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export async function fetchJSON(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, opts);
  return res.json();
}
