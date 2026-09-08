const CACHE_NAME = 'fitlife-v1';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.png',
  '/favicon.svg',
  '/apple-touch-icon.png',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-512-maskable.png'
];

// 1. Install Event - Pré-carrega arquivos essenciais para funcionamento offline
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('⚡ Service Worker: Pré-carregando arquivos para modo offline...');
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate Event - Limpa versões antigas de cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event - Estratégia Network-First com Fallback para Cache Offline
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Não intercepta requisições não-GET ou de extensões
  if (request.method !== 'GET' || !request.url.startsWith('http')) {
    return;
  }

  // Requisições para a API do Turso / Banco de Dados: tenta rede primeiro
  if (request.url.includes('turso.io') || request.url.includes('supabase.co')) {
    event.respondWith(
      fetch(request).catch(() => {
        // Retorna erro amigável se estiver offline (o app já possui Local-First fallback)
        return new Response(JSON.stringify({ error: 'offline' }), {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  // Para navegação e assets estáticos: Network-First com Cache Automático
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        // Se a rede falhar (ex: sem internet na academia), busca do cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // Se for uma navegação de página, retorna o index.html em cache (SPA)
        if (request.mode === 'navigate') {
          return caches.match('/index.html') || caches.match('/');
        }

        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
      })
  );
});
