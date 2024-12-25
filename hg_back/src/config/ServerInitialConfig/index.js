const express = require("express");

const ExpressRequestConfig = require("../ExpressRequestConfig");
const ExpressHeadersConfig = require("../ExpressHeadersConfig");
const ServerStaticConfig = require("../ServerStaticConfig");

/**
 * Configures an Express server with middleware for handling requests and serving static files.
 *
 * @returns {express.Application} The configured Express application instance.
 */
const ServerInitialConfig = () => {
    const app = express();

    ExpressRequestConfig(app);
    ExpressHeadersConfig(app);
    ServerStaticConfig(app);

    return app;
};

module.exports = ServerInitialConfig;
