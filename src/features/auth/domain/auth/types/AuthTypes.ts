export type { RegisterData } from '../types';
export type { AuthResponseDto as AuthResponse } from '@/api/contracts/auth';
export type { LoginInput as LoginData } from '../../../utils/validation';
export { loginInputSchema as loginDataSchema, registerInputSchema as registerDataSchema } from '../schemas';

export interface ServiceContext {
  component: string;
  action: string;
  data?: Record<string, unknown>;
}
