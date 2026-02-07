let state = {
  command: "NONE",
  time: Date.now()
};

export default {
  async fetch(req) {

    if (req.method === "POST") {
      const body = await req.json();
      const msg = (body.message || "").toLowerCase();

      if (msg.includes("nyalakan")) {
        state.command = "FLASH_ON";
      } else if (msg.includes("matikan")) {
        state.command = "FLASH_OFF";
      }

      state.time = Date.now();

      return new Response(JSON.stringify(state), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify(state), {
      headers: { "Content-Type": "application/json" }
    });
  }
};