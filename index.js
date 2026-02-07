export default {
  fetch(request) {
    const url = new URL(request.url)
    const cmd = url.searchParams.get("cmd") || "off"

    return new Response(cmd, {
      status: 200,
      headers: {
        "Content-Type": "text/plain"
      }
    })
  }
}
