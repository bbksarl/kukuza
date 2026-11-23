export const AUTH_USER_STORAGE_KEY = 'kukuza-auth-user';
// Nettoyage des anciennes sessions : les jetons ne sont plus conservés côté navigateur.
export const AUTH_TOKEN_STORAGE_KEY = 'kukuza-auth-token';

export type StoredAuthUser = Record<string, unknown>;

const canUseStorage = (): boolean => typeof window !== 'undefined';

export const readStoredAuthUser = (): StoredAuthUser | null => {
  if (!canUseStorage()) return null;
  try {
    const raw = window.localStorage.getItem(AUTH_USER_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as StoredAuthUser) : null;
  } catch {
    return null;
  }
};

export const clearLegacyAuthToken = (): void => {
  if (!canUseStorage()) return;
  try {
    window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  } catch {
    /* Le cookie HttpOnly reste la session de référence. */
  }
};

export const getStoredUserId = (): number | undefined => {
  const id = Number(readStoredAuthUser()?.id);
  return Number.isInteger(id) && id > 0 ? id : undefined;
};

export const getStoredBrandId = (): number | undefined => {
  const brandId = Number(readStoredAuthUser()?.brandId);
  return Number.isInteger(brandId) && brandId > 0 ? brandId : undefined;
};

export const clearStoredSession = (): void => {
  if (!canUseStorage()) return;
  try {
    window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    clearLegacyAuthToken();
  } catch {
    // Le logout mémoire reste effectif si le navigateur bloque le stockage.
  }
};
