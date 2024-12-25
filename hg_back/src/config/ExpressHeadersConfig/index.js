const express = require("express");

/**
 * Sets up middleware for adding common headers to Express responses.
 *
 * @param {express.Application} app - The Express application instance.
 */
const ExpressHeadersConfig = (app) => {
    /**
     * Sets the headers for each response.
     *
     * @param {express.Request} req - The Express request object.
     * @param {express.Response} res - The Express response object.
     * @param {Function} next - The next middleware function.
     */
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE");
        res.header("Access-Control-Allow-Headers", ["Content-Type", "x-access-token"]);
        next();
    });
};

module.exports = ExpressHeadersConfig;
