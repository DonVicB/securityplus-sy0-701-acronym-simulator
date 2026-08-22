const CACHE='securityplus701-acronyms-v6-1';
const ASSETS=[
  './','./index.html','./styles.css?build=10.1',
  './payload-data-1.js?build=10.1','./payload-data-2.js?build=10.1','./payload-data-3.js?build=10.1','./data-v8.js?build=10.1',
  './payload-app10-1.js?build=10.1','./payload-app10-2.js?build=10.1','./payload-app10-3.js?build=10.1','./payload-app10-4.js?build=10.1','./payload-app10-5.js?build=10.1','./payload-app10-6.js?build=10.1','./payload-app10-7.js?build=10.1','./app-v10.js?build=10.1',
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
