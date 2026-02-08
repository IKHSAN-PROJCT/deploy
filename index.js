export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    // =====================
    // HTML
    // =====================
    if (url.pathname === "/") {
      return new Response(HTML, {
        headers: { "Content-Type": "text/html" }
      })
    }

    // =====================
    // SEND COMMAND
    // =====================
    if (url.pathname === "/send" && request.method === "POST") {
      const body = await request.json()

      const cmd = {
        command: body.command,
        time: Date.now()
      }

      await env.COMMANDS.put("last_command", JSON.stringify(cmd))

      return new Response(
        JSON.stringify({ status: "ok", cmd }),
        { headers: { "Content-Type": "application/json" } }
      )
    }

    // =====================
    // RECEIVE COMMAND
    // =====================
    if (url.pathname === "/receive") {
      const data = await env.COMMANDS.get("last_command")

      if (!data) {
        return new Response(
          JSON.stringify({ command: null }),
          { headers: { "Content-Type": "application/json" } }
        )
      }

      // auto clear setelah diambil
      await env.COMMANDS.delete("last_command")

      return new Response(
        JSON.stringify({ command: JSON.parse(data) }),
        {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store"
          }
        }
      )
    }

    return new Response("Not Found", { status: 404 })
  }
}

const HTML = `
<!DOCTYPE html>
<html>
<body style="background:#111;color:#fff;text-align:center">
<h2>🔦 Remote Senter</h2>
<button onclick="send('FLASHLIGHT_ON')">ON</button>
<button onclick="send('FLASHLIGHT_OFF')">OFF</button>
<p id="s"></p>
<script>
async function send(c){
  await fetch('/send',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({command:c})
  })
  document.getElementById('s').innerText='Command terkirim: '+c
}
</script>
</body>
</html>
`
