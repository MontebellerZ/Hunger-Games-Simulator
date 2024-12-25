const express = require("express");

/**
 * Configures the specified Express application instance to serve static files from the "public" directory
 * at the "/public" URL path.
 *
 * @param {express.Application} app - The Express application instance.
 */
const ServerStaticConfig = (app) => {
    app.use("/public", express.static("public"));
};

module.exports = ServerStaticConfig;
