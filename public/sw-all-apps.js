const CACHE='rao-brothers-app-shell-v2';
const SHELL=['/','/customer.html','/admin','/worker','/manifest-customer.webmanifest','/manifest-admin.webmanifest','/manifest-worker.webmanifest'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL).catch(()=>{})).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('push',event=>{
 let data={title:'Rao Brothers',body:'New notification',url:'/'};
 try{data=event.data?event.data.json():data}catch(e){try{data.body=event.data.text()}catch(_){}}
 event.waitUntil(self.registration.showNotification(data.title||'Rao Brothers',{body:data.body||'',icon:'/icons/icon-customer-192.png',badge:'/icons/icon-customer-192.png',tag:data.tag||'rao-brothers',data:{url:data.url||'/'},renotify:true}));
});
self.addEventListener('notificationclick',event=>{event.notification.close();const url=event.notification.data?.url||'/';event.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{for(const c of list){if('focus' in c){c.navigate(url);return c.focus();}}return clients.openWindow(url)}));});
self.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET')return;const u=new URL(req.url);if(u.pathname.startsWith('/api/')||u.pathname.startsWith('/assets/uploads/'))return;event.respondWith(fetch(req).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put(req,cp)).catch(()=>{});return r}).catch(()=>caches.match(req).then(r=>r||caches.match('/'))));});
