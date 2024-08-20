
# fastify-health-check

`fastify-health-check` is a lightweight plugin for [Fastify](https://www.fastify.io/) that provides an endpoint for health checks. It's configurable and can be used to monitor the health of your service easily.

## Features

-   **Liveness and readiness endpoints**: Separate routes to handle liveness and readiness checks
-   **Custom readiness checks**: Implement custom logic to determine service readiness
-   **Configurable routes**: Easily configure the routes for health checks

## Install

```bash
npm install fastify-health-check
```

Or using yarn:

```bash
yarn add fastify-health-check
```

## Usage

Register the plugin with your Fastify instance:

```javascript
const fastify = require('fastify')();
const fastifyHealthCheck = require('fastify-health-check');

fastify.register(fastifyHealthCheck, {
  enableLiveness: true, // Defaults: True
  livenessRoute: "/health",
  enableReadiness: true, // Defaults: True
  readinessRoute: "/readiness",
  readinessCheckFn: (request: FastifyRequest) => {
    return {
      version: request.server.version,
      timestamp: new Date().toISOString(),
    };
  },
});

fastify.listen(3000, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info('Server listening on http://localhost:3000');
});
```

## Options

-   `enableLiveness`  (boolean, default:  `true`): Enable or disable the liveness check route.
-   `livenessRoute`  (string, default:  `/health`): The endpoint path for the liveness check.
-   `enableReadiness`  (boolean, default:  `true`): Enable or disable the readiness check route.
-   `readinessRoute`  (string, default:  `/readiness`): The endpoint path for the readiness check.
-   `readinessCheckFn`  (function, optional): A custom function that performs readiness checks. This function can use the Fastify request object to return custom information about the service readiness.

## Example

Here is an example of a more advanced health check:

```javascript
const fastify = require('fastify')();
const fastifyHealthCheck = require('fastify-health-check');

fastify.register(fastifyHealthCheck, {
  enableLiveness: true,
  livenessRoute: '/health',
  enableReadiness: true,
  readinessRoute: '/readiness',
  readinessCheckFn: (request) => {
    return {
      version: request.server.version,
      timestamp: new Date().toISOString(),
    };
  },
});

fastify.listen(3000, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info('Server is up and running at http://localhost:3000');
});
```

In this example, the liveness check is available at `/health`, and the readiness check is available at `/readiness`. The readiness check also includes a custom function that returns the server version and the current timestamp

## Test

To run the tests:

```bash
npm test
```

## License

Licensed under the [MIT License](./LICENSE).

## Acknowledgements

This plugin was inspired by the need for a simple and effective way to monitor Fastify services
