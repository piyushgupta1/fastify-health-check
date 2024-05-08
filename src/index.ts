import { FastifyRequest, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

// define options
export interface IHealthPluginOptions {
  enableLiveness?: boolean;
  livenessRoute?: string;
  enableReadiness?: boolean;
  readinessRoute?: string;
  readinessCheckFn?: Function;
}

const defaultOptionArgs: Required<IHealthPluginOptions> = {
  enableLiveness: true,
  livenessRoute: "/health",
  enableReadiness: true,
  readinessRoute: "/readiness",
  readinessCheckFn: (request: FastifyRequest) => {
    return {
      version: request.server.version,
      timestamp: new Date().toISOString(),
    };
  },
};

export const plugin: FastifyPluginAsync<IHealthPluginOptions> = async (
  server,
  options
) => {
  const defaultedOpts = { ...defaultOptionArgs, ...options };

  // Expose Liveness Route
  if (defaultedOpts.enableLiveness) {
    server.route({
      method: "GET",
      url: defaultedOpts.livenessRoute,
      handler: async (_, reply) => {
        return reply.send("OK").headers({
          "cache-control": "no-cache",
        });
      },
    });
  }

  // Expose Readiness Route
  if (defaultedOpts.enableReadiness) {
    server.route({
      method: "GET",
      url: defaultedOpts.readinessRoute,
      handler: async (serverReq, reply) => {
        const response = defaultedOpts.readinessCheckFn(serverReq);
        const status = response ? 200 : 500;
        return reply.send(response).code(status).headers({
          "cache-control": "no-cache",
        });
      },
    });
  }
};

export default fp(plugin, {
  name: "fastify-health-check",
  fastify: "4.x",
});
