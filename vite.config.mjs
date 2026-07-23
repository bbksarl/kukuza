import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';

const root = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

const resolveDependencyRoot = (packageName) => {
  const searchPaths = [root];

  let resolved;
  try {
    resolved = require.resolve(`${packageName}/package.json`, { paths: searchPaths });
  } catch {
    resolved = require.resolve(packageName, { paths: searchPaths });
    let candidate = path.dirname(resolved);
    while (candidate !== path.dirname(candidate)) {
      const packageJsonPath = path.join(candidate, 'package.json');
      if (existsSync(packageJsonPath)) {
        try {
          if (JSON.parse(readFileSync(packageJsonPath, 'utf8')).name === packageName) {
            return candidate;
          }
        } catch {
          // Continue walking up when a package manifest is not readable.
        }
      }
      candidate = path.dirname(candidate);
    }
    return path.dirname(resolved);
  }
  return path.dirname(resolved);
};

const resolveDependencyFile = (packageName, fileName) => {
  try {
    return require.resolve(`${packageName}/${fileName}`, { paths: [root] });
  } catch {
    throw new Error(`Dependency ${packageName}/${fileName} is not installed in the unified app`);
  }
};

export default {
  root,
  publicDir: path.resolve(root, 'public'),
  resolve: {
    alias: {
      '@': path.resolve(root, 'src'),
      '@/': path.resolve(root, 'src/'),
      '@kukuza/facade': path.resolve(root, 'facade/src/index.ts'),
      '@kukuza/facade/': path.resolve(root, 'facade/src/'),
      react: resolveDependencyRoot('react'),
      'react-dom': resolveDependencyRoot('react-dom'),
      'react-router-dom': resolveDependencyRoot('react-router-dom'),
      'lucide-react': resolveDependencyRoot('lucide-react'),
      'react-icons': resolveDependencyRoot('react-icons'),
      gsap: resolveDependencyRoot('gsap'),
      recharts: resolveDependencyRoot('recharts'),
      zod: resolveDependencyRoot('zod'),
      tailwindcss: resolveDependencyFile('tailwindcss', 'index.css'),
    },
  },
  server: {
    port: 3000,
    strictPort: true,
    fs: {
      allow: [root],
    },
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
  build: {
    outDir: path.resolve(root, 'dist'),
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
        },
      },
    },
  },
};
