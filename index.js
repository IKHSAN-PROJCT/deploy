export default {
  async fetch(req, env) {
    const url = new URL(req.url);

    if (url.pathname === "/poll") {
      const cmd = await env.STATE.get("CMD");
      if (cmd) {
        await env.STATE.delete("CMD");
        return new Response(cmd);
      }
      return new Response("");
    }

    if (url.pathname === "/set_cmd") {
      const cmd = url.searchParams.get("cmd");
      if (cmd) {
        await env.STATE.put("CMD", cmd);
        return new Response("OK");
      }
    }

    return new Response("404", { status: 404 });
  }
};
