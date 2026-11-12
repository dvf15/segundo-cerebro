/* Service worker do Simulador de Remuneração Executiva.
   Escopo é a raiz do site, então só intercepta as URLs desta ferramenta —
   as demais páginas do domínio seguem direto para a rede. */
const CACHE = "simremun-v1";
const ARQUIVOS = [
  "./simulador-remuneracao.html",
  "./remuneracao.webmanifest",
  "./remuneracao-icon.svg",
  "./remuneracao-icon-180.png",
  "./remuneracao-icon-192.png",
  "./remuneracao-icon-512.png"
];
const MEU = /^\/(simulador-remuneracao\.html|remuneracao-icon|remuneracao\.webmanifest|sw-remuneracao\.js)/;

self.addEventListener("install", function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(ARQUIVOS); }).then(function(){ return self.skipWaiting(); }));
});

self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});

/* rede primeiro, cache como reserva: nunca serve versão velha com a rede disponível */
self.addEventListener("fetch", function(e){
  var url = new URL(e.request.url);
  if(url.origin !== self.location.origin) return;
  if(!MEU.test(url.pathname)) return;
  if(e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(function(r){
      var copia = r.clone();
      caches.open(CACHE).then(function(c){ c.put(e.request, copia); });
      return r;
    }).catch(function(){ return caches.match(e.request); })
  );
});
