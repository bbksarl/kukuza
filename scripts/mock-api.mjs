import { createServer } from 'node:http';

const product = {
  id: 123,
  name: 'Robe SSR de test',
  description: 'Produit de démonstration servi par le faux backend des tests.',
  price: 45000,
  imageUrl: '/assets/products/p1.webp',
  category: 'vetements',
  brand: { id: 9, name: 'Atelier Test' },
  sizes: ['M', 'L'],
};

createServer((request, response) => {
  if (request.url === '/healthz') {
    response.writeHead(200).end('ok');
    return;
  }
  if (request.url === '/api/Product/123') {
    response.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify(product));
    return;
  }
  if (request.url === '/api/Product/404') {
    response
      .writeHead(404, { 'Content-Type': 'application/problem+json' })
      .end(JSON.stringify({ title: 'Produit introuvable', status: 404 }));
    return;
  }
  response.writeHead(404).end();
}).listen(4720, '127.0.0.1');
