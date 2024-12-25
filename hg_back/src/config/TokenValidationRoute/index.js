const express = require("express");
const jwt = require("jsonwebtoken");
const HttpError = require("../../errors/HttpError");

const HASH_CRIPTOGRAFIA = process.env.HASH_CRIPTOGRAFIA;

/**
 * Middleware function to validate JWT token in a request header.
 *
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @param {Function} next - The next function to pass control to next middleware.
 * @returns {void}
 */
const TokenValidationRoute = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) throw new HttpError("TokenNotFound", 401, "Token was not sended with the request");

    jwt.verify(token, HASH_CRIPTOGRAFIA, (error, decoded) => {
        if (error)
            throw new HttpError("TokenInvalid", 401, "Invalid or expired authentication token");

        req.email = decoded.email;
        next();
    });
};

module.exports = TokenValidationRoute;
