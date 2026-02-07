// Variabel global untuk status terakhir
let LAST_CMD = "off";

export default {
  fetch(request) {
    const url = new URL(request.url);
    const cmd = url.searchParams.get("cmd");

    // ==== API Sender → update status ====
    if (cmd === "on" || cmd === "off") {
      LAST_CMD = cmd;
      return new Response("OK", {
        headers: {
          "Content-Type": "text/plain",
          "Cache-Control": "no-store, no-cache, must-revalidate"
        }
      });
    }

    // ==== HTML interface ====
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8"/>
        <title>Flash Controller</title>
        <style>
          body { font-family: sans-serif; background: #121212; color: #eee; text-align: center; margin-top: 50px; }
          button { font-size: 20px; padding: 15px 40px; margin: 10px; border: none; border-radius: 10px; cursor: pointer; }
          #on { background: #4caf50; color: white; }
          #off { background: #f44336; color: white; }
          #status { font-size: 24px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <h1>Flash Controller</h1>
        <button id="on">ON</button>
        <button id="off">OFF</button>
        <div id="status">Status: ${LAST_CMD.toUpperCase()}</div>

        <script>
          const statusEl = document.getElementById('status');

          async function sendCmd(cmd) {
            await fetch('?cmd=' + cmd);
          }

          document.getElementById('on').onclick = function() { sendCmd('on'); };
          document.getElementById('off').onclick = function() { sendCmd('off'); };

          // polling tiap 1 detik untuk update status real-time
          async function updateStatus() {
            try {
              const res = await fetch('/');
              const text = await res.text();
              statusEl.innerText = 'Status: ' + text.toUpperCase();
            } catch(e){}
            setTimeout(updateStatus, 1000);
          }
          updateStatus();
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
};
