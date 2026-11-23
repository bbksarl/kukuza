import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { request as requestHttp } from 'node:http';
import { request as requestHttps } from 'node:https';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');
const apiOrigin = new URL(process.env['KUKUZA_API_UPSTREAM'] || 'http://host.docker.internal:7200');
if (
  !['http:', 'https:'].includes(apiOrigin.protocol) ||
  apiOrigin.username ||
  apiOrigin.password ||
  apiOrigin.pathname !== '/' ||
  apiOrigin.search ||
  apiOrigin.hash
) {
  throw new Error('KUKUZA_API_UPSTREAM doit être une origine HTTP(S) sans identifiants ni chemin.');
}
const csp =
  "default-src 'self'; base-uri 'self'; form-action 'self'; object-src 'none'; frame-ancestors 'self'; script-src 'self'; connect-src 'self'; img-src 'self' https: data: blob:; media-src 'self' https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com";
const defaultAllowedHosts =
  process.env['NODE_ENV'] === 'production'
    ? 'kukuza.com,www.kukuza.com'
    : 'localhost,127.0.0.1,kukuza.com,www.kukuza.com';
const allowedHosts = (process.env['SSR_ALLOWED_HOSTS'] || defaultAllowedHosts)
  .split(',')
  .map((host) => host.trim().toLowerCase())
  .filter(Boolean);
if (!allowedHosts.length || allowedHosts.includes('*')) {
  throw new Error('SSR_ALLOWED_HOSTS doit contenir des hôtes explicites, sans joker.');
}

const app = express();
const angularApp = new AngularNodeAppEngine({ allowedHosts });

app.disable('x-powered-by');
app.get('/healthz', (_request, response) => response.status(200).type('text/plain').send('ok'));
app.use((_request, response, next) => {
  response.setHeader('X-Frame-Options', 'SAMEORIGIN');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.setHeader('Strict-Transport-Security', 'max-age=31536000');
  response.setHeader('Content-Security-Policy', csp);
  next();
});

app.use('/api', (request, response) => {
  if (!allowedHosts.includes(request.hostname.toLowerCase())) {
    response.status(400).type('text/plain').send('Hôte non autorisé.');
    return;
  }

  const target = new URL(request.originalUrl, apiOrigin);
  const headers = { ...request.headers };
  delete headers['x-forwarded-for'];
  delete headers['x-forwarded-host'];
  delete headers['x-forwarded-port'];
  delete headers['x-forwarded-proto'];
  delete headers['x-forwarded-prefix'];
  const options = {
    method: request.method,
    headers: {
      ...headers,
      host: target.host,
      'x-forwarded-host': request.headers.host ?? target.host,
      'x-forwarded-proto': request.protocol,
      'x-forwarded-for': request.socket.remoteAddress ?? '',
    },
  };
  const handleResponse = (upstreamResponse: import('node:http').IncomingMessage) => {
    response.status(upstreamResponse.statusCode ?? 502);
    for (const [name, value] of Object.entries(upstreamResponse.headers)) {
      if (value !== undefined && !['connection', 'transfer-encoding'].includes(name.toLowerCase()))
        response.setHeader(name, value);
    }
    upstreamResponse.pipe(response);
  };
  const upstream =
    target.protocol === 'https:'
      ? requestHttps(target, options, handleResponse)
      : requestHttp(target, options, handleResponse);

  upstream.on('error', () => {
    if (!response.headersSent) {
      response.status(503).type('application/problem+json').send({
        title: 'API indisponible',
        status: 503,
      });
    } else response.destroy();
  });
  request.on('aborted', () => upstream.destroy());
  request.pipe(upstream);
});

app.use(
  express.static(browserDistFolder, {
    maxAge: '1d',
    index: false,
    redirect: false,
    setHeaders(response, path) {
      if (/-[A-Z0-9]{8,}\.(?:js|css)$/i.test(path)) {
        response.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    },
  }),
);

app.use((request, response, next) => {
  angularApp
    .handle(request)
    .then((result) => (result ? writeResponseToNodeResponse(result, response) : next()))
    .catch(next);
});

app.use((_request, response) => response.status(404).end());
app.use(
  (error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
    console.error('SSR request failed', error);
    if (!response.headersSent) response.status(500).type('text/plain').send('Erreur serveur.');
    else response.destroy();
  },
);

if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = Number(process.env['PORT'] || 4000);
  app.listen(port, '0.0.0.0', () => {
    console.log(`KUKUZA SSR listening on port ${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
