// Ekanthi service worker — notifications only (no offline cache, so app updates load instantly)
self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener("push", function (e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { title: "Ekanthi", body: e.data ? e.data.text() : "" }; }
  e.waitUntil(self.registration.showNotification(d.title || "Ekanthi", {
    body: d.body || "", icon: "/icon-192.png", badge: "/badge-96.png", tag: d.tag || "ekanthi", renotify: true,
    data: { url: d.url || "/" }, vibrate: [120, 60, 120]
  }));
});
self.addEventListener("notificationclick", function (e) {
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || "/";
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
    for (var i = 0; i < list.length; i++) { if ("focus" in list[i]) return list[i].focus(); }
    return self.clients.openWindow(url);
  }));
});
