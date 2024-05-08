"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = void 0;
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const defaultOptionArgs = {
    enableLiveness: true,
    livenessRoute: "/health",
    enableReadiness: true,
    readinessRoute: "/readiness",
    readinessCheckFn: (request) => {
        return {
            version: request.server.version,
            timestamp: new Date().toISOString(),
        };
    },
};
const plugin = async (server, options) => {
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
exports.plugin = plugin;
exports.default = (0, fastify_plugin_1.default)(exports.plugin, {
    name: "fastify-health-check",
    fastify: "4.x",
});
