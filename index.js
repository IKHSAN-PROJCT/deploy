let LAST_COMMAND = {
  id: 0,
  command: "NONE"
};

export default {
  async fetch(req) {
    if (req.method === "POST") {
      const body = await req.json();
      LAST_COMMAND = {
        id: Date.now(),
        command: body.message
      };
      return Response.json({ status: "OK" });
    }

    if (req.method === "GET") {
      return Response.json(LAST_COMMAND);
    }

    return new Response("Not Allowed", { status: 405 });
  }
};SON.stringify(state), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify(state), {
      headers: { "Content-Type": "application/json" }
    });
  }
};