import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useForm } from '../hooks/useForm';
import { useAuth } from '../hooks/useAuth';
import * as yup from 'yup';
import { ERROR_MESSAGES } from '../utils/messages';
import { AuthLayout } from '../components/layout/AuthLayout';

const registerValidationSchema = yup.object().shape({
  username: yup
    .string()
    .required(ERROR_MESSAGES.USERNAME_REQUIRED),
  email: yup
    .string()
    .email(ERROR_MESSAGES.EMAIL_INVALID)
    .required(ERROR_MESSAGES.EMAIL_REQUIRED),
  password: yup
    .string()
    .min(8, ERROR_MESSAGES.PASSWORD_TOO_SHORT)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      ERROR_MESSAGES.PASSWORD_WEAK
    )
    .required(ERROR_MESSAGES.PASSWORD_REQUIRED),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], ERROR_MESSAGES.PASSWORD_MISMATCH)
    .required(ERROR_MESSAGES.PASSWORD_REQUIRED),
});

const initialValues = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loading, error: authError } = useAuth();
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm(initialValues, registerValidationSchema);

  const handleRegister = async (formValues) => {
    const { confirmPassword, ...userData } = formValues;
    try {
      await register(userData);
      navigate('/');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };


  return (
    <AuthLayout>
      <div className="w-full space-y-3 p-2 sm:p-4">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-primary">Inscription</h2>
        </div>

        {authError && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-3 py-2 rounded relative text-sm" role="alert">
            <span className="block sm:inline">{authError}</span>
          </div>
        )}

        <form className="mt-2 sm:mt-3 space-y-2 sm:space-y-3" onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(handleRegister);
        }}>
          <div className="space-y-1 sm:space-y-2">
            <Input
              label="Nom d'utilisateur"
              type="text"
              name="username"
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.username}
              touched={touched.username}
              placeholder="votre nom d'utilisateur"
            />

            <Input
              label="Email"
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              touched={touched.email}
              placeholder="votre@email.com"
            />

            <Input
              label="Mot de passe"
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password}
              touched={touched.password}
              placeholder="••••••••"
            />

            <Input
              label="Confirmer le mot de passe"
              type="password"
              name="confirmPassword"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.confirmPassword}
              touched={touched.confirmPassword}
              placeholder="••••••••"
            />
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-400">
              Déjà inscrit?{' '}
              <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
                Se connecter
              </Link>
            </p>
          </div>

          <Button
            type="submit"
            variant="primary"
            loading={loading}
          >
            S'inscrire
          </Button>

        </form>
      </div>
    </AuthLayout>
  );
};