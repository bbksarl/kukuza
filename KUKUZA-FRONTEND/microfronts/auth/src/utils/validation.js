import * as yup from 'yup';
import { ERROR_MESSAGES } from './messages';

export const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email(ERROR_MESSAGES.EMAIL_INVALID)
    .required(ERROR_MESSAGES.EMAIL_REQUIRED),
  password: yup
    .string()
    .min(8, ERROR_MESSAGES.PASSWORD_TOO_SHORT)
    .required(ERROR_MESSAGES.PASSWORD_REQUIRED),
});