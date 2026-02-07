let LAST_CMD = "off"

export default {
  fetch(request) {
    const url = new URL(request.url)
    const cmd = url.searchParams.get("cmd")

    // ==== SENDER ====
    if (cmd === "on" || cmd === "off") {
      LAST_CMD = cmd
      return new Response("OK", {
        headers: {
          "Content-Type": "text/plain",
          "Cache-Control": "no-store, no-cache, must-revalidate"
        }
      })
    }

    // ==== RECEIVER ====
    return new Response(LAST_CMD, {
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "no-store, no-cache, must-revalidate"
      }
    })
  }
}