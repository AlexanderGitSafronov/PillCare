// Custom service worker for PillCare push notifications
self.addEventListener("push", function (event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "PillCare";
  const options = {
    body: data.body || "Час прийняти ліки",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: data.primaryKey || "1",
      url: data.url || "/dashboard",
    },
    actions: [
      {
        action: "taken",
        title: "✅ Прийнято",
      },
      {
        action: "snooze",
        title: "⏰ Нагадати пізніше",
      },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  if (event.action === "taken") {
    // Mark as taken
    const data = event.notification.data;
    event.waitUntil(
      fetch(`/api/history/${data.primaryKey}/taken`, { method: "POST" })
    );
  } else if (event.action === "snooze") {
    // Snooze 15 minutes
    event.waitUntil(
      self.registration.showNotification("PillCare — Нагадування", {
        body: event.notification.body,
        icon: "/icons/icon-192x192.png",
        data: event.notification.data,
        showTrigger: new TimestampTrigger(Date.now() + 15 * 60 * 1000),
      }).catch(() => {})
    );
  } else {
    event.waitUntil(
      clients.openWindow(event.notification.data?.url || "/dashboard")
    );
  }
});
