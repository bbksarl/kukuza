import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const environmentScript = resolve(process.cwd(), 'scripts/environment.mjs');
const temporaryDirectories: string[] = [];

function runEnvironment(
  mode: string,
  values: Record<string, string> = {},
  files: Record<string, string> = {},
) {
  const cwd = mkdtempSync(join(tmpdir(), 'kukuza-environment-'));
  temporaryDirectories.push(cwd);
  mkdirSync(join(cwd, 'src', 'config'), { recursive: true });
  for (const [name, contents] of Object.entries(files)) writeFileSync(join(cwd, name), contents);
  const result = spawnSync(process.execPath, [environmentScript, mode], {
    cwd,
    env: { PATH: process.env.PATH ?? '', ...values },
    encoding: 'utf8',
  });
  return { cwd, result };
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe('environment build guard', () => {
  it('ignores local development overrides and credentials in a production build', () => {
    const { cwd, result } = runEnvironment(
      'production',
      { VITE_ENABLE_API_MOCKS: 'true' },
      {
        '.env.local': 'VITE_ENABLE_API_MOCKS=true\nVITE_DEFAULT_ADMIN_PASSWORD=local-only',
      },
    );
    expect(result.status).toBe(0);
    expect(result.stderr).toBe('');
    expect(result.stdout).toBe('');
    const generated = readFileSync(resolve(cwd, 'src/config/environment.generated.ts'), 'utf8');
    expect(generated).toContain('"MODE": "production"');
    expect(generated).toContain('"VITE_ENABLE_API_MOCKS": "false"');
    expect(generated).not.toContain('VITE_DEFAULT_ADMIN_PASSWORD');
  });

  it('refuses cross-origin production APIs to keep session cookies same-site', () => {
    const { result } = runEnvironment('production', {
      VITE_ENABLE_API_MOCKS: 'false',
      VITE_API_BASE_URL: 'https://api.example.com',
    });

    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('même origine');
  });
});
