export default {
  async fetch(request) {
    const url = new URL(request.url)
    const cmd = url.searchParams.get("cmd") || "off"

    return new Response(cmd, {
      headers: { "Content-Type": "text/plain" }
    })
  }
}new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }

    // ===== POST : DARI SENDER =====
    if (request.method === "POST") {
      try {
        const body = await request.json();
        const msg = (body.message || "").toLowerCase();

        if (
          msg.includes("nyalakan") ||
          msg.includes("flash on")
        ) {
          lastCommand = "FLASH_ON";
          lastTime = Date.now();
        } else if (
          msg.includes("matikan") ||
          msg.includes("flash off")
        ) {
          lastCommand = "FLASH_OFF";
          lastTime = Date.now();
        }

        return new Response(
          JSON.stringify({
            status: "OK",
            command: lastCommand,
            time: lastTime
          }),
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          }
        );

      } catch (e) {
        return new Response(
          JSON.stringify({ status: "ERROR" }),
          { status: 400 }
        );
      }
    }

    // ===== GET : DARI RECEIVER =====
    if (request.method === "GET") {
      return new Response(
        JSON.stringify({
          command: lastCommand,
          time: lastTime
        }),
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }

    return new Response("Method Not Allowed", { status: 405 });
  }
};