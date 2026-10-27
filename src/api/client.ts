import { FacadeClient } from '@kukuza/facade';
import { getStoredAuthToken } from '@/core/auth/sessionStorage';

export const facadeClient = new FacadeClient({ getAccessToken: getStoredAuthToken });

export {
  FacadeClient,
  FacadeHttpError,
  FacadeRedirectError,
} from '@kukuza/facade';

export type {
  FacadeErrorPayload,
  FacadeOptions,
  FacadeRedirectEvent,
  FacadeRequestOptions,
  FacadeRuntimeConfig,
} from '@kukuza/facade';
