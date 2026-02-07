let lastCommand = "NONE";

export default {
  async fetch(request) {

    // POST → kirim command
    if (request.method === "POST") {
      const data = await request.json();

      if (data.message) {
        const msg = data.message.toLowerCase();

        if (msg.includes("nyalakan")) {
          lastCommand = "FLASH_ON";
        } else if (msg.includes("matikan")) {
          lastCommand = "FLASH_OFF";
        }
      }

      return new Response(
        JSON.stringify({
          status: "OK",
          command: lastCommand
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // GET → receiver ambil command
    return new Response(lastCommand, {
      headers: { "Content-Type": "text/plain" }
    });
  }
};
