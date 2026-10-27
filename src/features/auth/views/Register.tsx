import React, { useState, FC } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useForm } from '../hooks/useForm';
import { useAuth } from '../hooks/useAuth';
import { registerValidationSchema } from '../utils/validation';
import { AuthLayout } from '@/layouts/auth/AuthLayout';
import { BoutiqueRegisterPage } from './BoutiqueRegister';
import { config } from '../config/environment';
import { useLanguage } from '@/core/i18n';

interface RegisterFormValues {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const initialValues: RegisterFormValues = {
  name: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export const RegisterPage: FC = () => {
  const { register, loading, error: authError } = useAuth();
  const { t, translateText } = useLanguage();
  const [isBoutique, setIsBoutique] = useState<boolean>(false);
  const [boutiqueDraft, setBoutiqueDraft] = useState<Omit<RegisterFormValues, 'confirmPassword'> | null>(null);
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm<RegisterFormValues>(initialValues, registerValidationSchema);

  const handleContinueToBoutique = (formValues: RegisterFormValues): void => {
    const { confirmPassword, ...userData } = formValues;
    setBoutiqueDraft(userData);
  };

  const handleRegister = async (formValues: RegisterFormValues): Promise<void> => {
    const { confirmPassword, ...userData } = formValues;
    
    try {
      const result = await register({ ...userData, isBoutique: false });
      window.location.assign(result.redirectUrl ?? config.routes.storefrontUrl);
    } catch {
    }
  };


  if (boutiqueDraft) {
    return <BoutiqueRegisterPage userData={boutiqueDraft} onBack={() => setBoutiqueDraft(null)} />;
  }

  return (
    <AuthLayout>
      <div className="w-full space-y-1.5 sm:space-y-2 md:space-y-2.5">
        <div className="text-center">
          <h2 className="text-sm xs:text-base sm:text-lg md:text-xl font-bold text-primary">{t('auth.register')}</h2>
        </div>

        {authError && (
          <div className="auth-error-alert bg-red-500 bg-opacity-10 border border-red-500 text-white px-2.5 sm:px-3 py-1.5 rounded relative text-xs sm:text-sm" role="alert">
            <span className="block sm:inline">{translateText(authError)}</span>
          </div>
        )}

        <form
          className="mt-1 sm:mt-1.5 md:mt-2 space-y-1.5 sm:space-y-2"
          onSubmit={handleSubmit((formValues) => {
            if (isBoutique) {
              handleContinueToBoutique(formValues);
              return;
            }
            return handleRegister(formValues);
          })}
        >
          <div className="space-y-1 sm:space-y-1.5">
            <Input
              label={t('auth.fullName')}
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.name}
              touched={touched.name}
              placeholder={t('auth.namePlaceholder')}
            />

            <Input
              label={t('auth.username')}
              type="text"
              name="username"
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.username}
              touched={touched.username}
              placeholder={t('auth.usernamePlaceholder')}
            />

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

            <Input
              label={t('auth.confirmPassword')}
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

          <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-1.5 xs:gap-2 py-0.5 xs:py-1 sm:py-1.5">
            <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-2.5">
              <div className="relative inline-flex items-center">
                <input
                  type="checkbox"
                  id="isBoutique"
                  checked={isBoutique}
                  onChange={(e) => setIsBoutique(e.target.checked)}
                  className="peer sr-only"
                />
                <label 
                  htmlFor="isBoutique" 
                  className="relative flex items-center justify-center w-4.5 h-4.5 xs:w-5 xs:h-5 sm:w-6 sm:h-6 rounded-md cursor-pointer transition-all duration-300
                    bg-white/10 backdrop-blur-md border border-white/20
                    peer-checked:bg-[#297560]/20 peer-checked:border-[#297560] peer-checked:shadow-[0_0_12px_rgba(41,117,96,0.3)]
                    hover:bg-white/15 hover:border-white/30
                    peer-focus-visible:ring-2 peer-focus-visible:ring-[#297560]/50 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-transparent"
                >
                  <svg 
                    className={`w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-[#297560] transition-all duration-300 ${
                      isBoutique ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                    }`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth="3"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </label>
              </div>
              <label 
                htmlFor="isBoutique" 
                className="text-xs xs:text-xs sm:text-sm font-medium text-white/90 cursor-pointer select-none whitespace-nowrap"
              >
                {t('auth.shopAccount')}
              </label>
            </div>
            <p className="text-[0.688rem] xs:text-xs sm:text-sm text-gray-400 whitespace-nowrap">
              {t('auth.haveAccount')}{' '}
              <Link to="/auth/login" className="font-medium text-primary hover:text-primary-dark">
                {t('auth.submitLogin')}
              </Link>
            </p>
          </div>

          <Button
            type="submit"
            variant="primary"
            loading={loading}
          >
            {isBoutique ? t('auth.continue') : t('auth.signUp')}
          </Button>

        </form>
      </div>
    </AuthLayout>
  );
};
