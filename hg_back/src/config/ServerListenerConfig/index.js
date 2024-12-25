const express = require("express");
const UseProductionConnection = require("../../utils/UseProductionConnection");

/**
 * Throws an error if server port is not defined.
 */
const SERVER_PORT = process.env.SERVER_PORT;
if (!SERVER_PORT) throw "Server port not defined.";

/**
 * Logs a success message to the console when the server starts listening.
 */
const onSuccessListen = () => {
    const serverUsed = UseProductionConnection() ? "PRODUCTION" : "TEST";
    const successMesage = `Running ${serverUsed} server on port ${SERVER_PORT}`;
    console.log(successMesage);
};

/**
 * Configures the server to listen on the specified port and logs a success message to the console.
 *
 * @param {express.Application} app - The Express application instance.
 * @returns The new Express Server running
 */
const ServerListenerConfig = (app) => {
    return app.listen(SERVER_PORT, onSuccessListen);
};

module.exports = ServerListenerConfig;
