const express = require("express");
const routes = require("../../routes");

/**
 * Configures the specified Express application instance to use the routes defined in the "routes" module.
 *
 * @param {express.Application} app - The Express application instance.
 */
const ServerSetRoutes = (app) => {
    app.use("/", routes);
};

module.exports = ServerSetRoutes;
