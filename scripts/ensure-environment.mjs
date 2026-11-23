import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

if (!existsSync('src/config/environment.generated.ts')) {
  const result = spawnSync(process.execPath, ['scripts/environment.mjs', 'development'], {
    stdio: 'inherit',
  });

  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
}
