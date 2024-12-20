const cacheName = "cache-v1";
const resourcesToPrecache = ["/", "/next.svg"];

self.addEventListener("install", (event) => {
  console.log("NEW Service worker installing...");

  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(resourcesToPrecache);
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("NEW Service worker activating...");
});

self.addEventListener("fetch", (event) => {
  console.log(event.request);
  if (
    event.request.method !== "GET" ||
    ["font", "style", "script"].includes(event.request.destination)
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log("Found in cache", event.request.url);
        return cachedResponse;
      }

      console.log("Network request", event.request.url);
      return fetch(event.request);
    })
  );
});

self.addEventListener("push", (event) => {
  console.log("Push received", event);
  setTimeout(() => {
    const data = {
      title: "Test Notification",
      body: "This is a test notification",
    };
    const options = {
      body: data.body,
      icon: "icon.png",
      badge: "badge.png",
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  }, 1000);
});

console.log("Service worker file executed 234");
