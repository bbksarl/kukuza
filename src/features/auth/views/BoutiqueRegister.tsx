import React, { useState, FC } from 'react';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useForm } from '../hooks/useForm';
import { useAuth } from '../hooks/useAuth';
import { boutiqueValidationSchema } from '../utils/validation';
import { AuthLayout } from '@/layouts/auth/AuthLayout';
import { config } from '../config/environment';
import type { BoutiqueProfileData } from '../domain/auth/types';
import { useLanguage } from '@/core/i18n';

interface BoutiqueFormValues {
  shopName: string;
  email: string;
  address: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
  description: string;
}

const initialValues: BoutiqueFormValues = {
  shopName: '',
  email: '',
  address: '',
  postalCode: '',
  country: 'Mali',
  phoneNumber: '',
  description: '',
};

interface CountryCode {
  code: string;
  country: string;
  flag: string;
}

const COUNTRY_CODES: CountryCode[] = [
  { code: '+221', country: 'Sénégal', flag: '🇸🇳' },
  { code: '+223', country: 'Mali', flag: '🇲🇱' },
  { code: '+225', country: 'Côte d\'Ivoire', flag: '🇨🇮' },
  { code: '+226', country: 'Burkina Faso', flag: '🇧🇫' },
  { code: '+227', country: 'Niger', flag: '🇳🇪' },
  { code: '+229', country: 'Bénin', flag: '🇧🇯' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
];

const COUNTRIES: string[] = [
  'Mali', 'Sénégal', 'Côte d\'Ivoire', 'Burkina Faso', 'Niger', 
  'Bénin', 'Togo', 'Guinée', 'France', 'Autre'
];

interface BoutiqueRegisterPageProps {
  userData: { name: string; email: string; password: string };
  onBack: () => void;
}

export const BoutiqueRegisterPage: FC<BoutiqueRegisterPageProps> = ({ userData, onBack }) => {
  const { register, loading, error: authError } = useAuth();
  const { t, translateText } = useLanguage();
  const [countryCode, setCountryCode] = useState<string>('+221');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm<BoutiqueFormValues>(initialValues, boutiqueValidationSchema);

  const handleBoutiqueRegister = async (formValues: BoutiqueFormValues): Promise<void> => {
    try {
      const boutique: BoutiqueProfileData = {
        shopName: formValues.shopName,
        address: formValues.address,
        postalCode: formValues.postalCode,
        country: formValues.country,
        phoneNumber: `${countryCode}${formValues.phoneNumber}`,
        description: formValues.description,
        logo: logoFile,
      };
      const result = await register({ ...userData, isBoutique: true, boutique });
      window.location.assign(result.redirectUrl ?? config.routes.storefrontUrl);
    } catch {
    }
  };

  const handleLogoChange = (file: File | null): void => {
    if (file && file.type.startsWith('image/')) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      handleLogoChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleLogoChange(file);
  };

  return (
    <AuthLayout>
      <div className="w-full space-y-1.5 sm:space-y-2 md:space-y-2.5">
        <div className="text-center">
          <h2 className="text-xs xs:text-sm sm:text-base md:text-lg font-bold text-white leading-tight">
            {t('auth.shopInfoTitle')}
          </h2>
        </div>

        {authError && (
          <div className="auth-error-alert bg-red-500 bg-opacity-10 border border-red-500 text-white px-2.5 sm:px-3 py-1.5 rounded relative text-xs sm:text-sm" role="alert">
            <span className="block sm:inline">{translateText(authError)}</span>
          </div>
        )}

        <form className="mt-1 xs:mt-1.5 sm:mt-2 space-y-1.5 sm:space-y-2" onSubmit={handleSubmit(handleBoutiqueRegister)}>
          <div className="space-y-1 sm:space-y-1.5">
            <Input
              label={t('auth.shopName')}
              type="text"
              name="shopName"
              value={values.shopName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.shopName}
              touched={touched.shopName}
              placeholder={t('auth.shopEmailPlaceholder')}
            />

            <Input
              label={t('auth.address')}
              type="text"
              name="address"
              value={values.address}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.address}
              touched={touched.address}
              placeholder={t('auth.addressPlaceholder')}
            />

            <div className="grid grid-cols-1 xs:grid-cols-3 gap-1.5 xs:gap-2">
              <div className="xs:col-span-2">
                <Input
                  label={t('auth.postalCode')}
                  type="text"
                  name="postalCode"
                  value={values.postalCode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.postalCode}
                  touched={touched.postalCode}
                  placeholder=""
                />
              </div>

              <div className="space-y-1 sm:space-y-1.5">
                <label className={`block text-xs sm:text-sm font-medium ${errors.country && touched.country ? 'text-red-400' : 'text-white/80'}`}>
                  {errors.country && touched.country ? translateText(errors.country) : t('auth.country')}
                </label>
                <select
                  name="country"
                  value={values.country}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`auth-input text-xs xs:text-sm ${errors.country && touched.country ? 'ring-2 ring-red-500 focus:ring-red-500 border-red-500' : ''}`}
                >
                  {COUNTRIES.map((country) => (
                    <option key={country} value={country} className="bg-gray-800">
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1 sm:space-y-1.5">
              <label className={`block text-xs sm:text-sm font-medium ${errors.phoneNumber && touched.phoneNumber ? 'text-red-400' : 'text-white/80'}`}>
                {errors.phoneNumber && touched.phoneNumber ? translateText(errors.phoneNumber) : t('auth.phone')}
              </label>
              <div className="flex gap-1.5 xs:gap-2">
                <select
                  value={countryCode}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCountryCode(e.target.value)}
                  className="auth-input !w-28 xs:!w-32 sm:!w-36 shrink-0 text-xs xs:text-sm"
                >
                  {COUNTRY_CODES.map((item) => (
                    <option key={item.code} value={item.code} className="bg-gray-800">
                      {item.flag} {item.code}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={values.phoneNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={t('auth.phonePlaceholder')}
                  className={`auth-input min-w-0 flex-1 ${errors.phoneNumber && touched.phoneNumber ? 'ring-2 ring-red-500 focus:ring-red-500 border-red-500' : ''}`}
                />
              </div>
            </div>

            <div className="space-y-1 sm:space-y-1.5">
              <label className={`block text-xs sm:text-sm font-medium ${errors.description && touched.description ? 'text-red-400' : 'text-white/80'}`}>
                {errors.description && touched.description ? translateText(errors.description) : t('auth.description')}
              </label>
              <textarea
                name="description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={t('auth.shopDescriptionPlaceholder')}
                rows={2}
                className={`auth-input resize-none min-h-[3.5rem] xs:min-h-[4rem] ${errors.description && touched.description ? 'ring-2 ring-red-500 focus:ring-red-500 border-red-500' : ''}`}
              />
            </div>

            <div className="space-y-1 sm:space-y-1.5">
              <label className="block text-xs sm:text-sm font-medium text-white/80">
                {t('auth.shopLogo')}
              </label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                  relative border-2 border-dashed rounded-lg p-3 xs:p-4 sm:p-5 text-center
                  transition-all duration-200 cursor-pointer
                  ${isDragging 
                    ? 'border-primary bg-primary/10' 
                    : 'border-gray-500/30 bg-gray-600/20 hover:bg-gray-600/30'
                  }
                `}
                onClick={() => document.getElementById('logo-upload')?.click()}
              >
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
                {logoPreview ? (
                  <div className="space-y-1 xs:space-y-1.5">
                    <img 
                      src={logoPreview} 
                      alt={t('auth.shopLogo')}
                      className="mx-auto h-14 xs:h-16 sm:h-20 w-auto object-contain rounded"
                    />
                    <p className="text-[0.688rem] xs:text-xs text-white/70 truncate">{logoFile?.name}</p>
                  </div>
                ) : (
                  <div className="space-y-1 xs:space-y-1.5">
                    <svg className="mx-auto h-7 xs:h-8 sm:h-10 w-7 xs:w-8 sm:w-10 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="text-[0.688rem] xs:text-xs sm:text-sm text-white/70">
                      {t('auth.clickUpload')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            loading={loading}
          >
            {t('auth.signUp')}
          </Button>
          <button type="button" className="w-full text-sm text-white/80 underline" onClick={onBack}>
            {t('auth.backAccount')}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};
