let LAST_COMMAND = null

export default {
  async fetch(request) {
    const url = new URL(request.url)

    // =====================
    // HTML CONTROL PANEL
    // =====================
    if (url.pathname === "/") {
      return new Response(HTML, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      })
    }

    // =====================
    // SEND COMMAND
    // =====================
    if (url.pathname === "/send" && request.method === "POST") {
      const body = await request.json()

      LAST_COMMAND = {
        command: body.command,
        time: Date.now(),
      }

      return new Response(
        JSON.stringify({ status: "ok", command: LAST_COMMAND }),
        { headers: { "Content-Type": "application/json" } }
      )
    }

    // =====================
    // RECEIVE COMMAND
    // =====================
    if (url.pathname === "/receive") {
      return new Response(
        JSON.stringify({ command: LAST_COMMAND }),
        { headers: { "Content-Type": "application/json" } }
      )
    }

    return new Response("Not Found", { status: 404 })
  },
}

const HTML = `
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Remote Flash Control</title>
<style>
body {
  background:#020617;
  color:#e5e7eb;
  font-family:Arial;
  display:flex;
  justify-content:center;
  align-items:center;
  height:100vh;
}
.box {
  background:#0f172a;
  padding:20px;
  border-radius:12px;
  width:260px;
  text-align:center;
}
button {
  width:100%;
  padding:12px;
  margin-top:10px;
  border:none;
  border-radius:8px;
  font-size:16px;
  cursor:pointer;
}
.on { background:#22c55e; }
.off { background:#ef4444; }
.status {
  margin-top:12px;
  font-size:14px;
  opacity:.8;
}
</style>
</head>
<body>
<div class="box">
  <h3>🔦 Remote Senter</h3>

  <button class="on" onclick="send('FLASHLIGHT_ON')">
    Nyalakan Senter
  </button>

  <button class="off" onclick="send('FLASHLIGHT_OFF')">
    Matikan Senter
  </button>

  <div class="status" id="status">Status: idle</div>
</div>

<script>
async function send(cmd) {
  document.getElementById("status").innerText = "Mengirim..."
  await fetch("/send", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ command: cmd })
  })
  document.getElementById("status").innerText =
    "Command terkirim: " + cmd
}
</script>
</body>
</html>
`
