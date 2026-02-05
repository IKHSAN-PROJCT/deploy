// ================================
// GLOBAL STATE (mirip variable server Node)
// ================================
let lastCommand = "NONE";

// ================================
// HELPER RESPONSE (ala Node res.json)
// ================================
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}

// ================================
// MAIN HANDLER (mirip app.listen)
// ================================
export default {
  async fetch(req, env) {
    const method = req.method;

    // ===== CORS PREFLIGHT =====
    if (method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }

    // ===== POST → CONTROLLER (com.RAT) =====
    if (method === "POST") {
      try {
        const body = await req.json();
        const msg = String(body.message || "").toLowerCase();

        if (
          msg.includes("nyalakan senter") ||
          msg.includes("hidupkan senter") ||
          msg.includes("flash on")
        ) {
          lastCommand = "FLASH_ON";
        } else if (
          msg.includes("matikan senter") ||
          msg.includes("flash off")
        ) {
          lastCommand = "FLASH_OFF";
        } else {
          lastCommand = "NONE";
        }

        return jsonResponse({
          status: "OK",
          command: lastCommand
        });

      } catch (err) {
        return jsonResponse({ status: "ERROR" }, 400);
      }
    }

    // ===== GET → TARGET (com.DEPLOY) =====
    if (method === "GET") {
      return jsonResponse({
        command: lastCommand
      });
    }

    // ===== METHOD NOT ALLOWED =====
    return jsonResponse({ error: "Method Not Allowed" }, 405);
  }
};
