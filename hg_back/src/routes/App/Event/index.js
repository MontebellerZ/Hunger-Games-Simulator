const express = require("express");

/**
 * Express Router for Web User related routes.
 * @type {express.Router}
 */
const routerAppEvent = express.Router();
const AsyncMysqlQuery = require("../../../utils/AsyncMysqlQuery");
const HttpError = require("../../../errors/HttpError");
const TokenValidationRoute = require("../../../config/TokenValidationRoute");

const SELECT_ALL_EVENT_QUERY = `SELECT e.*, COUNT(e.id) AS leadsCount FROM events AS e LEFT JOIN leads AS l ON l.user_id = e.id GROUP BY e.id ORDER BY e.id DESC`;
const INSERT_EVENT_QUERY = `INSERT INTO events (name, start_date, end_date) VALUES (?, ?, ?)`;
const UPDATE_EVENT_QUERY = `UPDATE events SET name = ?, start_date = ?, end_date = ? WHERE id = ?`;


/**
 * Route for user login.
 *
 * @param {express.Request} req - Express Request object.
 * @param {express.Response} res - Express Response object.
 * @param {express.NextFunction} next - Express NextFunction.
 */
routerAppEvent.post("/", TokenValidationRoute, async (req, res, next) => {
    try {
        const { name, startDate, endDate } = req.body;

        // validate input
        if (!name || !startDate || !endDate)
            throw new HttpError("InvalidInput", 400, "Name, startDate and endDate are required");

        // validate input
        if (typeof name !== "string")
            throw new HttpError("InvalidInput", 400, "Name must be string");

        if (new Date(startDate) > new Date(endDate)) 
            throw new HttpError("InvalidInput", 400, "Unable to create an event with a start date greater than the end date")

        const resultInsertEvent = await AsyncMysqlQuery(INSERT_EVENT_QUERY, [
            name,
            startDate,
            endDate,
        ]).catch((err) => {
            if (err.code === "ER_DUP_ENTRY") {
                throw new HttpError(
                    "InvalidCombination",
                    409,
                    `This combination of name, startDate and endDate is already registered`
                );
            }

            throw err;
        });

        const insertedEventId = resultInsertEvent.insertId;

        if (isNaN(insertedEventId))
            throw new HttpError("DatabaseError", 500, "Event id not retrieved");

        res.send({ insertedEventId });
    } catch (err) {
        next(err);
    }
});

/**
 * Route for user login.
 *
 * @param {express.Request} req - Express Request object.
 * @param {express.Response} res - Express Response object.
 * @param {express.NextFunction} next - Express NextFunction.
 */
routerAppEvent.get("/all", TokenValidationRoute, async (req, res, next) => {
    try {
        const resultSelectAllLeads = await AsyncMysqlQuery(SELECT_ALL_EVENT_QUERY);

        if (!Array.isArray(resultSelectAllLeads))
            throw new HttpError("DatabaseError", 500, "Result is not an array");

        res.send(resultSelectAllLeads);
    } catch (err) {
        next(err);
    }
});

routerAppEvent.put("/:id", TokenValidationRoute, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, startDate, endDate } = req.body;
        
        // validate input
        if (!name || !startDate || !endDate)
            throw new HttpError("InvalidInput", 400, "Name, startDate and endDate are required");

        // validate input
        if (typeof name !== "string")
            throw new HttpError("InvalidInput", 400, "Name must be string");

        if (new Date(startDate) > new Date(endDate)) 
            throw new HttpError("InvalidInput", 400, "Unable to create an event with a start date greater than the end date")

        const resultInsertEvent = await AsyncMysqlQuery(UPDATE_EVENT_QUERY, [
            name,
            startDate,
            endDate,
            id,
        ]).catch((err) => {
            if (err.code === "ER_DUP_ENTRY") {
                throw new HttpError(
                    "InvalidCombination",
                    409,
                    `This combination of name, startDate and endDate is already registered`
                );
            }

            throw err;
        });

        const insertedEventId = resultInsertEvent.insertId;

        if (isNaN(insertedEventId))
            throw new HttpError("DatabaseError", 500, "Event id not retrieved");

        res.send({ insertedEventId });
    } catch (err) {
        next(err);
    }
})

module.exports = routerAppEvent;
