let COMMAND = "NONE"; // default

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === "/get") {
      return new Response(COMMAND, { "Content-Type": "text/plain" });
    }
    return new Response("WORKER RUNNING", { "Content-Type": "text/plain" });
  }
};
