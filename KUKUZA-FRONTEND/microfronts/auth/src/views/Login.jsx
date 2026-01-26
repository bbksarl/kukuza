import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useForm } from '../hooks/useForm';
import { useAuth } from '../hooks/useAuth';
import { loginValidationSchema } from '../utils/validation';
import { AuthLayout } from '../components/layout/AuthLayout';

const initialValues = {
  email: '',
  password: '',
};

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading, error: authError } = useAuth();
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm(initialValues, loginValidationSchema);

  const handleLogin = async (formValues) => {
    try {
      await login(formValues);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };


  return (
    <AuthLayout>
      <div className="w-full space-y-3 p-2 sm:p-4">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-primary">Connexion</h2>
        </div>

        {authError && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-3 py-2 rounded relative text-sm" role="alert">
            <span className="block sm:inline">{authError}</span>
          </div>
        )}

        <form className="mt-2 sm:mt-3 space-y-2 sm:space-y-3" onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(handleLogin);
        }}>
          <div className="space-y-2 sm:space-y-3">
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
          </div>

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-xs font-medium text-white hover:text-green-400 transition-colors">
              Mot de passe oublié !
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            loading={loading}
          >
            Se connecter
          </Button>

          <div className="text-right">
            <p className="text-xs text-gray-400">
              Pas encore de compte?{' '}
              <Link to="/register" className="font-medium text-primary hover:text-primary-dark">
                S'inscrire
              </Link>
            </p>
          </div>

        </form>
      </div>
    </AuthLayout>
  );
}