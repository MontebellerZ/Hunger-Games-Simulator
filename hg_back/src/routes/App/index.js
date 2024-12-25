const express = require("express");

/**
 * Router for mobile application
 * @type {express.Router}
 */
const routerApp = express.Router();

/**
 * Router for mobile user
 * @type {express.Router}
 */
const routerAppUser = require("./User");

/**
 * Router for leads
 * @type {express.Router}
 */
const routerAppLead = require("./Lead");

/**
 * Router for events
 * @type {express.Router}
 */
const routerAppEvent = require("./Event");

/**
 * Use router for mobile user
 */
routerApp.use("/user", routerAppUser);
routerApp.use("/lead", routerAppLead);
routerApp.use("/event", routerAppEvent);

module.exports = routerApp;
