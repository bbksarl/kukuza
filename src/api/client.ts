import { FacadeClient } from '@kukuza/facade';
import { getStoredAuthToken } from '@/core/auth/sessionStorage';
import { runtimeConfig } from '@/config/runtime';
import { DemoFacadeClient } from './demoClient';

export const facadeClient = runtimeConfig.enableApiMocks
  ? new DemoFacadeClient()
  : new FacadeClient({ getAccessToken: getStoredAuthToken });

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
