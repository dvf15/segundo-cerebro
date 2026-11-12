// Service worker cache-first: o jogo abre offline após a primeira visita.
const CACHE = 'bloquinhos-v17';
const ARQUIVOS = [
  '.', 'index.html', 'manifest.json', 'icon.svg', 'icon-tom.png',
  'css/style.css',
  'fonts/baloo-2-latin-400-normal.woff2', 'fonts/baloo-2-latin-700-normal.woff2',
  'fonts/baloo-2-latin-800-normal.woff2', 'fonts/OFL-LICENSE.txt',
  'js/main.js', 'js/audio.js', 'js/storage.js', 'js/characters.js', 'js/engine.js',
  'js/teclado.js', 'js/gerador.js', 'js/robos.js', 'js/voz.js', 'js/popup.js',
  'js/screens/inicio.js', 'js/screens/sandbox.js', 'js/screens/contas.js',
  'js/screens/jogos.js', 'js/screens/robos.js', 'js/screens/album.js', 'js/screens/pais.js',
  'js/jogos/complete10.js', 'js/jogos/padrao.js', 'js/jogos/balanca.js',
  'js/jogos/quadrados.js', 'js/jogos/trilha.js',
  'js/robos/comande.js', 'js/robos/formas.js', 'js/robos/areas.js',
  'js/robos/caixas.js', 'js/robos/angulos.js', 'js/robos/contagem.js', 'js/robos/planetas.js',
  'js/screens/fisica.js', 'js/fisica/inercia.js', 'js/fisica/forca.js',
  'js/fisica/reacao.js', 'js/fisica/gravidade.js', 'js/fisica/calor.js',
  'js/screens/dinheiro.js', 'js/dinheiro/mercado.js', 'js/dinheiro/shopping.js',
  'js/dinheiro/cofrinho.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((chaves) => Promise.all(chaves.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) => hit ||
      fetch(e.request).then((resp) => {
        const copia = resp.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copia));
        return resp;
      })
    )
  );
});
