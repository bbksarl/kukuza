import { chmodSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { afterEach, describe, expect, it } from 'vitest';

const deployScript = resolve(process.cwd(), 'scripts/deploy-container.sh');
const temporaryDirectories: string[] = [];

function runDeployment(health: 'healthy' | 'unhealthy') {
  const directory = mkdtempSync(join(tmpdir(), 'kukuza-deploy-'));
  temporaryDirectories.push(directory);
  const bin = join(directory, 'bin');
  const log = join(directory, 'docker.log');
  const dockerMock = join(bin, 'docker');
  mkdirSync(bin, { recursive: true });
  writeFileSync(
    dockerMock,
    `#!/bin/sh
printf '%s\\n' "$*" >> "$DOCKER_LOG"
if [ "$1" = inspect ]; then
  case "$*" in
    *--format*) printf '%s\\n' "$DOCKER_HEALTH"; exit 0 ;;
    *) exit 1 ;;
  esac
fi
exit 0
`,
  );
  chmodSync(dockerMock, 0o755);
  const result = spawnSync('sh', [deployScript, 'registry.example/kukuza/web', 'main'], {
    encoding: 'utf8',
    env: {
      ...process.env,
      PATH: `${bin}:${process.env.PATH ?? ''}`,
      DOCKER_LOG: log,
      DOCKER_HEALTH: health,
    },
  });

  return { result, log };
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe('container deployment', () => {
  it('keeps the new container only after its health check succeeds', () => {
    const { result, log } = runDeployment('healthy');
    const commands = readFileSync(log, 'utf8').trim().split('\n');

    expect(result.status).toBe(0);
    expect(commands[0]).toBe('pull registry.example/kukuza/web:main');
    expect(commands.some((command) => command.startsWith('run -d'))).toBe(true);
    expect(commands.at(-1)).toBe('image prune -f');
  });

  it('removes an unhealthy replacement and fails the deployment', () => {
    const { result, log } = runDeployment('unhealthy');
    const commands = readFileSync(log, 'utf8');

    expect(result.status).not.toBe(0);
    expect(commands).toContain('rm -f kukuza-frontend-main');
    expect(commands).not.toContain('image prune -f');
  });

  it('rejects an unsafe image tag before invoking Docker', () => {
    const result = spawnSync('sh', [deployScript, 'registry.example/kukuza/web', 'main;touch'], {
      encoding: 'utf8',
    });

    expect(result.status).toBe(2);
    expect(result.stderr).toContain('Invalid image tag');
  });
});
