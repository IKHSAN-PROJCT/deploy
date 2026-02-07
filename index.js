let LAST_CMD = "off"

export default {
  fetch(request) {
    const url = new URL(request.url)
    const cmd = url.searchParams.get("cmd")

    // Jika sender kirim on / off → simpan
    if (cmd === "on" || cmd === "off") {
      LAST_CMD = cmd
      return new Response("OK")
    }

    // Receiver ambil perintah terakhir
    return new Response(LAST_CMD, {
      headers: {
        "Content-Type": "text/plain"
      }
    })
  }
}
