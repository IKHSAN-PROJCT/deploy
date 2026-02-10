export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Simpan token & chat_id
    if (request.method === "POST" && url.pathname === "/save") {
      try {
        const data = await request.json();
        if (!data.token || !data.chat_id) {
          return new Response(JSON.stringify({ error: "token dan chat_id dibutuhkan" }), { status: 400 });
        }

        await env.TELEGRAM_DATA.put("TOKEN", data.token);
        await env.TELEGRAM_DATA.put("CHAT_ID", data.chat_id);

        return new Response(JSON.stringify({ success: true }));
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
      }
    }

    // Ambil token & chat_id
    if (request.method === "GET" && url.pathname === "/get") {
      try {
        const token = await env.TELEGRAM_DATA.get("TOKEN");
        const chat_id = await env.TELEGRAM_DATA.get("CHAT_ID");

        return new Response(JSON.stringify({ token, chat_id }), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
      }
    }

    return new Response("Not found", { status: 404 });
  },
};
