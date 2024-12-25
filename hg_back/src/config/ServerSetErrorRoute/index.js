const express = require("express");

const HttpError = require("../../errors/HttpError");
const WriteErrorLog = require("../../utils/WriteErrorLog");

/**
 * Error handling middleware that logs errors and returns appropriate responses
 *
 * @param {HttpError|Error} err - The error to handle
 * @param {express.Request} req - The express request object
 * @param {express.Response} res - The express response object
 * @param {express.NextFunction} next - The express next function
 */
const onErrorRoute = (err, req, res, next) => {
    WriteErrorLog(err);

    if (err instanceof HttpError) {
        res.status(err.status).send({ ...err, message: err.message });
        return;
    }

    res.status(500).send({ message: "Unexpected error" });
};

/**
 * Function that sets up the error route for the server
 *
 * @param {express.Express} app - The express server instance
 */
const ServerSetErrorRoute = (app) => {
    app.use(onErrorRoute);
};

module.exports = ServerSetErrorRoute;
