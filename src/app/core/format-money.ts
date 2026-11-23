export type SupportedLanguage = 'en' | 'fr';

export function formatMoney(
  value: number,
  currency: string | null | undefined,
  language: SupportedLanguage,
): string {
  const safeCurrency = currency && /^[A-Z]{3}$/.test(currency) ? currency : 'XOF';
  return new Intl.NumberFormat(language === 'en' ? 'en-US' : 'fr-FR', {
    style: 'currency',
    currency: safeCurrency,
    maximumFractionDigits: safeCurrency === 'XOF' ? 0 : 2,
  }).format(value);
}
