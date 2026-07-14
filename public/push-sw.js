self.addEventListener("push", (event) => {
  const data = event.data
    ? event.data.json()
    : { title: "Digiart Creation", body: "New notification received." };

  event.waitUntil(
    self.registration.showNotification(data.title || "Digiart Creation", {
      body: data.body || "New notification received.",
      icon: "/digiart-logo.jpg",
      badge: "/digiart-logo.jpg",
      data: {
        url: data.url || "/",
      },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const matchingClient = clients.find((client) =>
        client.url.endsWith(targetUrl)
      );

      if (matchingClient) {
        return matchingClient.focus();
      }

      return self.clients.openWindow(targetUrl);
    })
  );
});
