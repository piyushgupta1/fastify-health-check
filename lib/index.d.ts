import { FastifyPluginAsync } from "fastify";
export interface IHealthPluginOptions {
    enableLiveness?: boolean;
    livenessRoute?: string;
    enableReadiness?: boolean;
    readinessRoute?: string;
    readinessCheckFn?: Function;
}
export declare const plugin: FastifyPluginAsync<IHealthPluginOptions>;
declare const _default: FastifyPluginAsync<IHealthPluginOptions>;
export default _default;
