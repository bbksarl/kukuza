export function safeReturnUrl(value: string | null | undefined): value is string {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return false;
  if ([...value].some((char) => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127)) return false;

  try {
    const target = new URL(value, 'https://kukuza.invalid');
    return target.origin === 'https://kukuza.invalid' && !target.pathname.startsWith('//');
  } catch {
    return false;
  }
}
