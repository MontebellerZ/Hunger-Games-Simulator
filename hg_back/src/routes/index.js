const express = require("express");

/**
 * Router for application
 * @type {express.Router}
 */
const router = express.Router();

/**
 * Router for mobile application
 * @type {express.Router}
 */
const routerApp = require("./App");

/**
 * Handles GET requests to "/teste" endpoint
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 */
router.get("/teste", (req, res) => {
    res.send("testado");
});

/**
 * Uses mobile router for "/app" endpoint
 */
router.use("/app", routerApp);

module.exports = router;
