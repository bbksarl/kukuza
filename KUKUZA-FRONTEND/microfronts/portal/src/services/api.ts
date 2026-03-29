export async function getProducts(page = 1, limit = 12): Promise<{ items: any[]; total: number; page: number; limit: number } | null> {
  const apiBase = import.meta.env.VITE_API_URL;
  if (!apiBase) {
    // no backend configured
    return null;
  }

  try {
    const base = apiBase.replace(/\/$/, '');
    const url = `${base}/products?page=${encodeURIComponent(String(page))}&limit=${encodeURIComponent(String(limit))}`;
    const res = await fetch(url, { credentials: 'same-origin' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    // expect backend to return { items, total, page, limit }
    return data;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[api] getProducts failed', err);
    return null;
  }
}

export async function getCategories(): Promise<any[] | null> {
  const apiBase = import.meta.env.VITE_API_URL;
  if (!apiBase) return null;
  try {
    const url = `${apiBase.replace(/\/$/, '')}/categories`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[api] getCategories failed', err);
    return null;
  }
}

export async function getCreators(): Promise<any[] | null> {
  const apiBase = import.meta.env.VITE_API_URL;
  if (!apiBase) return null;

  try {
    const url = `${apiBase.replace(/\/$/, '')}/creators`;
    const res = await fetch(url, { credentials: 'same-origin' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[api] getCreators failed', err);
    return null;
  }
}
