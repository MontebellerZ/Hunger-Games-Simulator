const express = require("express");

/**
 * Middleware for configuring the request handling of an Express application.
 *
 * @param {express.Application} app - The Express application instance.
 */
const ExpressRequestConfig = (app) => {
    /**
     * Middleware for parsing JSON request bodies.
     */
    app.use(express.json());

    /**
     * Middleware for parsing URL-encoded request bodies.
     *
     * @param {object} options - The options for the URL-encoded body parser.
     * @param {boolean} options.extended - Whether to use the qs library for parsing nested objects (default: false).
     * @param {string} options.type - The MIME type of the URL-encoded data (default: "application/x-www-form-urlencoded").
     */
    app.use(
        express.urlencoded({
            extended: true,
            type: "application/json",
        })
    );
};

module.exports = ExpressRequestConfig;
