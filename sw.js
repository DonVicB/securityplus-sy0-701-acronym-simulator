const CACHE='securityplus701-acronyms-v5';
const ASSETS=[
  './','./index.html','./styles.css?build=9',
  './payload-data-1.js?build=9','./payload-data-2.js?build=9','./payload-data-3.js?build=9','./data-v8.js?build=9',
  './payload-app9-1.js?build=9','./payload-app9-2.js?build=9','./payload-app9-3.js?build=9','./app-v9.js?build=9',
  './manifest.webmanifest','./icon.svg'
];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put('./index.html',copy));return r}).catch(()=>caches.match('./index.html')));
    return;
  }
  e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request)));
});
