export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const auth = request.headers.get("Authorization");

    // proteksi secret key
    if (auth !== `Bearer ${env.SECRET_KEY}`) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // Simpan token & chat_id
    if (request.method === "POST" && url.pathname === "/save") {
      const data = await request.json();
      await env.TELEGRAM_DATA.put("TOKEN", data.token);
      await env.TELEGRAM_DATA.put("CHAT_ID", data.chat_id);
      return new Response(JSON.stringify({ success: true }));
    }

    // Ambil token & chat_id
    if (request.method === "GET" && url.pathname === "/get") {
      const token = await env.TELEGRAM_DATA.get("TOKEN");
      const chat_id = await env.TELEGRAM_DATA.get("CHAT_ID");
      return new Response(JSON.stringify({ token, chat_id }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Not found", { status: 404 });
  },
};
