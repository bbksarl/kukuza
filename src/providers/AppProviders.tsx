import type { PropsWithChildren } from 'react';
import { LanguageProvider } from '@/core/i18n';

/** Application-wide provider boundary. Feature providers can be composed here. */
export function AppProviders({ children }: PropsWithChildren) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
