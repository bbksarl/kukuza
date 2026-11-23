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
const csp =
  "default-src 'self'; base-uri 'self'; form-action 'self'; object-src 'none'; frame-ancestors 'self'; script-src 'self'; connect-src 'self'; img-src 'self' https: data: blob:; media-src 'self' https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com";
const allowedHosts = (process.env['SSR_ALLOWED_HOSTS'] || 'localhost,127.0.0.1,kukuza.com,www.kukuza.com')
  .split(',')
  .map((host) => host.trim())
  .filter(Boolean);

const app = express();
const angularApp = new AngularNodeAppEngine({ allowedHosts });

app.disable('x-powered-by');
app.get('/healthz', (_request, response) => response.status(200).type('text/plain').send('ok'));
app.use((_request, response, next) => {
  response.setHeader('X-Frame-Options', 'SAMEORIGIN');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.setHeader('Content-Security-Policy', csp);
  next();
});

app.use('/api', (request, response) => {
  const target = new URL(request.originalUrl, apiOrigin);
  const options = {
    method: request.method,
    headers: {
      ...request.headers,
      host: target.host,
      'x-forwarded-host': request.headers['x-forwarded-host'] ?? request.headers.host ?? '',
      'x-forwarded-proto': request.headers['x-forwarded-proto'] ?? request.protocol,
      'x-forwarded-for': [request.headers['x-forwarded-for'], request.socket.remoteAddress]
        .filter(Boolean)
        .join(', '),
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
