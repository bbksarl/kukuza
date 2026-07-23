import { useCallback, useMemo, useState, ChangeEvent, FocusEvent, FormEvent } from 'react';
import { z } from 'zod';

interface UseFormProps<T> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleBlur: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => Promise<void>;
  handleSubmit: (callback: (values: T) => void | Promise<void>) => (e: FormEvent<HTMLFormElement>) => Promise<void>;
}

export const useForm = <T extends object>(
  initialValues: T,
  validationSchema: z.ZodSchema
): UseFormProps<T> => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = useCallback((fieldName: string, currentValues: T): string => {
    const result = validationSchema.safeParse(currentValues);

    if (result.success) {
      return '';
    }

    const fieldErrors = result.error.flatten().fieldErrors as Record<string, string[] | undefined>;
    const fieldError = fieldErrors[fieldName];

    if (Array.isArray(fieldError) && fieldError.length > 0) {
      return fieldError[0];
    }

    return '';
  }, [validationSchema]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;

    setValues((prev) => {
      const nextValues = { ...prev, [name]: value } as T;
      setErrors((currentErrors) => {
        if (!currentErrors[name]) {
          return currentErrors;
        }
        return { ...currentErrors, [name]: '' };
      });
      return nextValues;
    });
  }, []);

  const handleBlur = useCallback(async (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): Promise<void> => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateField(name, values);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  }, [validateField, values]);

  const validateForm = useCallback(async (): Promise<boolean> => {
    try {
      validationSchema.parse(values);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        const fieldErrors = error.flatten().fieldErrors;

        Object.entries(fieldErrors).forEach(([field, messages]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            newErrors[field] = messages[0];
          }
        });

        setErrors(newErrors);
        return false;
      }

      setErrors({ _general: 'Erreur de validation' });
      return false;
    }
  }, [validationSchema, values]);

  const handleSubmit = useCallback((onSubmit: (values: T) => void | Promise<void>) => {
    return async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const isValid = await validateForm();
      if (isValid) {
        await onSubmit(values);
      }
    };
  }, [validateForm, values]);

  return useMemo(() => ({
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  }), [errors, handleBlur, handleChange, handleSubmit, touched, values]);
};