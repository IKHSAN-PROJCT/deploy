let lastCommand = "NONE";

export default {
  async fetch(request) {

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }

    if (request.method === "POST") {
      const body = await request.json().catch(() => ({}));
      const msg = (body.message || "").toLowerCase();

      if (msg.includes("nyalakan senter") || msg.includes("flash on")) {
        lastCommand = "FLASH_ON";
      } else if (msg.includes("matikan senter") || msg.includes("flash off")) {
        lastCommand = "FLASH_OFF";
      } else {
        lastCommand = "NONE";
      }

      return new Response(
        JSON.stringify({ status: "OK", command: lastCommand }),
        { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
      );
    }

    return new Response(
      JSON.stringify({ command: lastCommand }),
      { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  }
};
