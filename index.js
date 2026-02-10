export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // ===============================
    // SSE CLIENTS
    // ===============================
    if (!globalThis.clients) {
      globalThis.clients = new Set();
    }

    // ===============================
    // /events  → dipakai Android
    // ===============================
    if (url.pathname === "/events") {
      const stream = new ReadableStream({
        start(controller) {
          const encoder = new TextEncoder();

          const send = (msg) => {
            controller.enqueue(
              encoder.encode(`data: ${msg}\n\n`)
            );
          };

          const client = { send };
          globalThis.clients.add(client);

          // kirim ping awal
          send("CONNECTED");

          request.signal.addEventListener("abort", () => {
            globalThis.clients.delete(client);
          });
        }
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // ===============================
    // /send?cmd=XXXX
    // ===============================
    if (url.pathname === "/send") {
      const cmd = url.searchParams.get("cmd");

      if (!cmd) {
        return new Response("NO_CMD", { status: 400 });
      }

      const decoded = decodeURIComponent(cmd);

      // broadcast ke semua client SSE
      if (globalThis.clients) {
        for (const c of globalThis.clients) {
          try {
            c.send(decoded);
          } catch (_) {}
        }
      }

      return new Response("OK", {
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // ===============================
    // ROOT
    // ===============================
    return new Response(
      "Cloudflare Worker Online 🚀",
      { headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
};
