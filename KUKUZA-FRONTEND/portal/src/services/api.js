// Lightweight API client helpers for the portal
// Usage:
//  - set VITE_API_URL in your environment (e.g. VITE_API_URL=http://localhost:4000/api)
//  - call getProducts() from components; it will return `null` on network/parse errors

export async function getProducts() {
  const apiBase = import.meta.env.VITE_API_URL;
  if (!apiBase) {
    // No backend configured in dev: caller should handle fallback to sample data
    return null;
  }

  try {
    const url = `${apiBase.replace(/\/$/, '')}/products`;
    const res = await fetch(url, { credentials: 'same-origin' });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (err) {
    // Don't throw — let the UI fallback to static data gracefully
    // Logging helps the dev know why data is missing
    // eslint-disable-next-line no-console
    console.warn('[api] getProducts failed, falling back to mock data', err);
    return null;
  }
}

export async function getCategories(){
  const apiBase = import.meta.env.VITE_API_URL;
  if (!apiBase) return null;
  try{
    const url = `${apiBase.replace(/\/$/, '')}/categories`;
    const res = await fetch(url);
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }catch(err){
    // eslint-disable-next-line no-console
    console.warn('[api] getCategories failed, falling back to mock', err);
    return null;
  }
}

export async function getCreators() {
  const apiBase = import.meta.env.VITE_API_URL;
  if (!apiBase) {
    return null;
  }

  try {
    const url = `${apiBase.replace(/\/$/, '')}/creators`;
    const res = await fetch(url, { credentials: 'same-origin' });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[api] getCreators failed, falling back to mock data', err);
    return null;
  }
}

export async function getBestSellers() {
  const apiBase = import.meta.env.VITE_API_URL;
  if (!apiBase) {
    return null;
  }

  try {
    const url = `${apiBase.replace(/\/$/, '')}/bestsellers`;
    const res = await fetch(url, { credentials: 'same-origin' });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[api] getBestSellers failed, falling back to mock data', err);
    return null;
  }
}
