export const MicrofrontRegistry = [
  {
    name: 'auth',
    url: 'http://localhost:8081/remoteEntry.js',
    module: './AuthApp',
    framework: 'vue',
  },
  {
    name: 'user',
    url: 'http://localhost:8082/remoteEntry.js',
    module: './UserApp',
    framework: 'react',
  },
  {
    name: 'admin',
    url: 'http://localhost:8083/remoteEntry.js',
    module: './AdminApp',
    framework: 'angular',
  },
  {
    name: 'analytics',
    url: 'http://localhost:8084/remoteEntry.js',
    module: './AnalyticsApp',
    framework: 'svelte',
  },
];
