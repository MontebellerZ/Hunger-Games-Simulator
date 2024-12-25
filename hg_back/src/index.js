/**
 * Loads environment variables from the .env file.
 */
require("dotenv").config();

/**
 * Gets the server port from the environment variables and throws an error if it is not defined.
 */
const SERVER_PORT = process.env.SERVER_PORT;
if (!SERVER_PORT) throw "Server port not defined.";

/**
 * Import server configuration functions from the appropriate modules.
 */
const ServerInitialConfig = require("./config/ServerInitialConfig");
const ServerListenerConfig = require("./config/ServerListenerConfig");
const ServerSetErrorRoute = require("./config/ServerSetErrorRoute");
const ServerSetRoutes = require("./config/ServerSetRoutes");

/**
 * Creates an instance of an Express application by calling the ServerInitialConfig function.
 */
const app = ServerInitialConfig();

/**
 * Sets up the routes for the application by calling the ServerSetRoutes function.
 * @param {Express.Application} app - The Express application instance.
 */
ServerSetRoutes(app);

/**
 * Sets up the error route for the application by calling the ServerSetErrorRoute function.
 * @param {Express.Application} app - The Express application instance.
 */
ServerSetErrorRoute(app);

/**
 * Starts the server by calling the ServerListenerConfig function and returns the application instance and server object as a module export.
 * @param {Express.Application} app - The Express application instance.
 * @returns {Object} - The server object as a module export.
 */
const server = ServerListenerConfig(app);

module.exports = { app, server };
