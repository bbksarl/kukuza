import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useForm } from '../hooks/useForm';
import { useAuth } from '../hooks/useAuth';
import { loginValidationSchema } from '../utils/validation';
import { AuthLayout } from '@/layouts/auth/AuthLayout';
import { config } from '../config/environment';
import { useLanguage } from '@/core/i18n';

const initialValues = {
  email: '',
  password: '',
};

export const LoginPage = () => {
  const navigate = useNavigate();
  const { t, translateText } = useLanguage();
  const { login, loading, error: authError } = useAuth();
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm(initialValues, loginValidationSchema);

  const handleLogin = async (formValues: typeof initialValues) => {
    try {
      const result = await login(formValues);
      const destination = result.role === 'admin'
        ? '/admin/dashboard'
        : (result.redirectUrl ?? config.routes.storefrontUrl);
      window.location.assign(destination);
    } catch {
    }
  };


  return (
    <AuthLayout>
      <div className="w-full space-y-2 xs:space-y-2.5 sm:space-y-3">
        <div className="text-center">
          <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-primary">{t('auth.login')}</h2>
        </div>

        {authError && (
          <div className="auth-error-alert bg-red-500 bg-opacity-10 border border-red-500 text-white px-2.5 sm:px-3 py-1.5 sm:py-2 rounded relative text-xs sm:text-sm" role="alert">
            <span className="block sm:inline">{translateText(authError)}</span>
          </div>
        )}

        <form className="mt-1.5 xs:mt-2 sm:mt-3 space-y-1.5 xs:space-y-2 sm:space-y-3" onSubmit={handleSubmit(handleLogin)}>
          <div className="space-y-1.5 xs:space-y-2 sm:space-y-3">
            <Input
              label={t('auth.email')}
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              touched={touched.email}
              placeholder={t('auth.emailPlaceholder')}
            />

            <Input
              label={t('auth.password')}
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

          <div className="flex justify-end pt-0.5">
            <Link to="/forgot-password" className="text-[0.688rem] xs:text-xs sm:text-sm font-medium text-white hover:text-green-400 transition-colors">
              {t('auth.forgotPassword')}
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            loading={loading}
          >
            {t('auth.submitLogin')}
          </Button>

          <div className="text-right pt-0.5">
            <p className="text-[0.688rem] xs:text-xs sm:text-sm text-gray-400">
              {t('auth.noAccount')}{' '}
              <Link to="/auth/register" className="font-medium text-primary hover:text-primary-dark">
                {t('auth.signUp')}
              </Link>
            </p>
          </div>

        </form>
      </div>
    </AuthLayout>
  );
}
