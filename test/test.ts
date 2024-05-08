import test from "tape";
import Fastify, { FastifyRequest } from "fastify";
import healthPlugin, { IHealthPluginOptions } from "../lib";

test("request tests, default fastify options", async (testGroup) => {
  const app = Fastify();
  const opts: IHealthPluginOptions = {};
  await app.register(healthPlugin, opts);

  testGroup.test("Liveness route registerd, with response 'OK'", (t) => {
    t.plan(2);
    app.inject({ method: "GET", url: "/health" }, (err, res) => {
      if (res) {
        t.equal(res.statusCode, 200);
        t.equal(res.body, "OK");
      }
    });
  });

  testGroup.test(
    "Readiness route registerd, with response JSON object",
    (t) => {
      t.plan(2);
      app.inject({ method: "GET", url: "/readiness" }, (err, res) => {
        if (res) {
          t.equal(res.statusCode, 200);
          t.ok(JSON.parse(res.body));
        }
      });
    }
  );
});

test("request tests, disable liveness, default readiness", async (testGroup) => {
  const app = Fastify();
  const opts: IHealthPluginOptions = {
    enableLiveness: false,
  };
  await app.register(healthPlugin, opts);

  testGroup.test("Liveness route not registerd, throws 404", (t) => {
    t.plan(1);
    app.inject({ method: "GET", url: "/health" }, (err, res) => {
      if (res) {
        t.equal(res.statusCode, 404);
      }
    });
  });

  testGroup.test(
    "Readiness route registerd, with response JSON object",
    (t) => {
      t.plan(2);
      app.inject({ method: "GET", url: "/readiness" }, (err, res) => {
        if (res) {
          t.equal(res.statusCode, 200);
          t.ok(JSON.parse(res.body));
        }
      });
    }
  );
});

test("request tests, default liveness, disable readiness", async (testGroup) => {
  const app = Fastify();
  const opts: IHealthPluginOptions = {
    enableReadiness: false,
  };
  await app.register(healthPlugin, opts);

  testGroup.test("Liveness route registerd, with response 'OK'", (t) => {
    t.plan(2);
    app.inject({ method: "GET", url: "/health" }, (err, res) => {
      if (res) {
        t.equal(res.statusCode, 200);
        t.equal(res.body, "OK");
      }
    });
  });

  testGroup.test("Readiness route not registerd, throws 404", (t) => {
    t.plan(1);
    app.inject({ method: "GET", url: "/readiness" }, (err, res) => {
      if (res) {
        t.equal(res.statusCode, 404);
      }
    });
  });
});

test("request tests, new routes for readiness and liveness", async (testGroup) => {
  const app = Fastify();
  const opts: IHealthPluginOptions = {
    livenessRoute: "/healthz",
    readinessRoute: "/readinessz",
  };
  await app.register(healthPlugin, opts);

  testGroup.test("Liveness route registerd, with route healthz", (t) => {
    t.plan(3);
    app.inject({ method: "GET", url: "/healthz" }, (err, res) => {
      if (res) {
        t.equal(res.statusCode, 200);
        t.equal(res.body, "OK");
      }
    });

    app.inject({ method: "GET", url: "/health" }, (err, res) => {
      if (res) {
        t.equal(res.statusCode, 404);
      }
    });
  });

  testGroup.test("Liveness route registerd, with route readinessz", (t) => {
    t.plan(3);
    app.inject({ method: "GET", url: "/readinessz" }, (err, res) => {
      if (res) {
        t.equal(res.statusCode, 200);
        t.ok(JSON.parse(res.body));
      }
    });

    app.inject({ method: "GET", url: "/readiness" }, (err, res) => {
      if (res) {
        t.equal(res.statusCode, 404);
      }
    });
  });
});

test("request tests, custom readiness functions", async (testGroup) => {
  const app = Fastify();
  const opts: IHealthPluginOptions = {
    readinessCheckFn: (request: FastifyRequest) => {
      return { hello: "world" };
    },
  };
  await app.register(healthPlugin, opts);

  testGroup.test("Liveness route registerd, with route healthz", (t) => {
    t.plan(2);
    app.inject({ method: "GET", url: "/readiness" }, (err, res) => {
      if (res) {
        t.equal(res.statusCode, 200);
        t.equal(res.body, JSON.stringify({ hello: "world" }));
      }
    });
  });
});
