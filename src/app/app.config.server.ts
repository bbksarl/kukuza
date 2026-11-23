import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { API_BASE_URL } from './core/api-base-url';

const apiOrigin = (process.env['KUKUZA_API_UPSTREAM'] || 'http://127.0.0.1:7200').replace(/\/$/, '');

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    { provide: API_BASE_URL, useValue: `${apiOrigin}/api` },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
