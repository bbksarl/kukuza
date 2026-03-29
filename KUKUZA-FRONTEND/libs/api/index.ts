/**
 * API Library - Point d'entrée centralisé pour tous les microfronts
 * 
 * Exporte:
 * - httpClient: HTTP client avec interceptors
 * - tokenService: Gestion des tokens JWT
 * - Configuration API
 */

export { httpClient, getHttpClient, HttpClient } from './httpClient';
export type { HttpResponse, RequestOptions } from './httpClient';

export { tokenService, TokenService, TOKEN_KEY, REFRESH_TOKEN_KEY } from './tokenService';
export type { TokenPayload } from './tokenService';

export { API_BASE_URL, API_URLS, HTTP_CONFIG } from './api.config';
