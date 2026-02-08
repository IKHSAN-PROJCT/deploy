// worker.js
let LAST_CMD = "NONE";

export default {
  async fetch(req) {
    const url = new URL(req.url);

    // SENDER kirim command
    if (url.searchParams.get("cmd")) {
      LAST_CMD = url.searchParams.get("cmd");
      return new Response("OK");
    }

    // RECEIVER ambil command
    if (url.pathname === "/get") {
      return new Response(LAST_CMD);
    }

    return new Response("READY");
  }
};
