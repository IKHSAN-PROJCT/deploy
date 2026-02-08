let LAST_CMD = "";
let LAST_LOCATION = "";

export default {
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;

    // ===== RECEIVER POLLING COMMAND =====
    if (path === "/get") {
      return new Response(LAST_CMD || "", {
        headers: { "Content-Type": "text/plain" }
      });
    }

    // ===== SENDER SET COMMAND =====
    if (path === "/set") {
      const cmd = url.searchParams.get("cmd") || "";
      LAST_CMD = cmd;
      return new Response("OK: " + cmd);
    }

    // ===== RECEIVER SEND LOCATION =====
    if (path === "/location") {
      const lat = url.searchParams.get("lat");
      const lon = url.searchParams.get("lon");

      if (lat && lon) {
        LAST_LOCATION = `${lat},${lon}`;
        return new Response("LOCATION SAVED");
      }

      return new Response("NO LOCATION", { status: 400 });
    }

    // ===== SENDER GET LAST LOCATION =====
    if (path === "/last_location") {
      return new Response(LAST_LOCATION || "", {
        headers: { "Content-Type": "text/plain" }
      });
    }

    return new Response("404");
  }
};
