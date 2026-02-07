// Variabel global menyimpan status terakhir
let LAST_CMD = "off";

// List client SSE
let clients = [];

export default {
  fetch(request) {
    const url = new URL(request.url);
    const cmd = url.searchParams.get("cmd");

    // ==== SENDER API → update state ====
    if (cmd === "on" || cmd === "off") {
      LAST_CMD = cmd;
      
      // Kirim update ke semua client SSE
      clients.forEach(c => {
        c.write(`data: ${LAST_CMD}\n\n`);
      });

      return new Response("OK", {
        headers: {
          "Content-Type": "text/plain",
          "Cache-Control": "no-store, no-cache, must-revalidate"
        }
      });
    }

    // ==== SSE Endpoint ====
    if (url.pathname === "/events") {
      const stream = new ReadableStream({
        start(controller) {
          const encoder = new TextEncoder();
          // Kirim initial state
          controller.enqueue(encoder.encode(`data: ${LAST_CMD}\n\n`));

          // Simpan controller sebagai client
          clients.push(controller);

          // Hapus client saat stream selesai
          const interval = setInterval(() => {}, 1000); // keep alive
          const cleanup = () => {
            clearInterval(interval);
            clients = clients.filter(c => c !== controller);
          };

          controller.close = (() => {
            cleanup();
            return controller.close.bind(controller);
          })();
        }
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-store, no-cache, must-revalidate",
          "Connection": "keep-alive"
        }
      });
    }

    // ==== HTML UI ====
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8"/>
        <title>Flash Controller SSE</title>
        <style>
          body { font-family: sans-serif; background: #121212; color: #eee; text-align: center; margin-top: 50px; }
          button { font-size: 20px; padding: 15px 40px; margin: 10px; border: none; border-radius: 10px; cursor: pointer; }
          #on { background: #4caf50; color: white; }
          #off { background: #f44336; color: white; }
          #status { font-size: 24px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <h1>Flash Controller SSE</h1>
        <button id="on">ON</button>
        <button id="off">OFF</button>
        <div id="status">Status: ${LAST_CMD.toUpperCase()}</div>

        <script>
          const statusEl = document.getElementById('status');

          async function sendCmd(cmd) {
            await fetch('?cmd=' + cmd);
          }

          document.getElementById('on').onclick = () => sendCmd('on');
          document.getElementById('off').onclick = () => sendCmd('off');

          // ==== SSE real-time update ====
          const evtSource = new EventSource('/events');
          evtSource.onmessage = function(event) {
            statusEl.innerText = 'Status: ' + event.data.toUpperCase();
          };
        </script>
      </body>
      </html>
    `;

    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store, no-cache, must-revalidate"
      }
    });
  }
}
