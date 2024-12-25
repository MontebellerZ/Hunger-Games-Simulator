const express = require("express");
/**
 * Express Router for Web User related routes.
 * @type {express.Router}
 */
const routerAppLead = express.Router();
const AsyncMysqlQuery = require("../../../utils/AsyncMysqlQuery");
const HttpError = require("../../../errors/HttpError");
const TokenValidationRoute = require("../../../config/TokenValidationRoute");
const XlsxFromJson = require("../../../utils/XslxFromJson");

const SELECT_ALL_LEAD_QUERY = `SELECT l.*, u.name AS user_name, e.name AS event_name  FROM leads AS l INNER JOIN users AS u ON l.user_id = u.id LEFT JOIN events As e ON e.id = l.event_id ORDER BY l.id DESC`;
const SELECT_USER_LEAD_QUERY = `SELECT l.*, u.name AS user_name, e.name AS event_name  FROM leads AS l INNER JOIN users AS u ON l.user_id = u.id LEFT JOIN events As e ON e.id = l.event_id WHERE u.id = ? ORDER BY l.id DESC `;
const SELECT_LEADS_RESULTS = `SELECT u.id as "userId", u.name as "Employee", COUNT(l.id) AS "Leads Amount" FROM users AS u INNER JOIN leads AS l ON l.user_id = u.id GROUP BY u.id ORDER BY u.name`;

const INSERT_LEAD_QUERY = `INSERT INTO leads (user_id, event_id, level, importance, studying, reason, name, phone, email, city, dec_, dec_name, dec_phone, dec_profession, profession, company, observations, campaign) VALUES ?`;

/**
 * Route for user login.
 *
 * @param {express.Request} req - Express Request object.
 * @param {express.Response} res - Express Response object.
 * @param {express.NextFunction} next - Express NextFunction.
 */
routerAppLead.post("/", TokenValidationRoute, async (req, res, next) => {
    try {
        let leads = req.body;
        if (!Array.isArray(leads)) {
            throw new HttpError("InvalidLeads", 400, "leads must be an array");
        }

        leads = leads.filter((lead) => {
            const {
                userId,
                eventId,
                level,
                importance,
                studying,
                reason,
                name,
                phone,
                email,
                city,
                dec,
                dec_name,
                dec_phone,
                dec_profession,
                profession,
                company,
                observations,
                campaign,
            } = lead;

            if (!userId || !name || !phone) return false;

            const mustBeStringVariables = [
                level,
                importance,
                reason,
                name,
                phone,
                email,
                city,
                dec_name,
                dec_phone,
                dec_profession,
                profession,
                company,
                observations,
            ];
            const validateStrings = mustBeStringVariables.some(
                (v) => v != null && typeof v !== "string"
            );
            if (validateStrings) return false;

            const mustBeBoolVariables = [studying, dec, campaign];
            const validateBools = mustBeBoolVariables.some(
                (v) => v != null && typeof v !== "boolean"
            );
            if (validateBools) return false;

            const mustBeNumberVariables = [userId, eventId];
            const validateNumbers = mustBeNumberVariables.some(
                (v) => v != null && typeof v !== "number"
            );
            if (validateNumbers) return false;

            return true;
        });

        let leadsValues = leads.map((lead) => {
            const {
                userId,
                eventId,
                level,
                importance,
                studying,
                reason,
                name,
                phone,
                email,
                city,
                dec,
                dec_name,
                dec_phone,
                dec_profession,
                profession,
                company,
                observations,
                campaign,
            } = lead;

            return [
                userId,
                eventId,
                level,
                importance,
                studying,
                reason,
                name,
                phone,
                email,
                city,
                dec,
                dec_name,
                dec_phone,
                dec_profession,
                profession,
                company,
                observations,
                campaign,
            ];
        });

        const resultInsertLead = await AsyncMysqlQuery(INSERT_LEAD_QUERY, [leadsValues]).catch(
            (err) => {
                if (err.code === "ER_NO_REFERENCED_ROW_2") {
                    throw new HttpError("InvalidIds", 409, `User ID or Event ID is not registered`);
                }

                throw err;
            }
        );

        const insertedLeadId = resultInsertLead.insertId;

        if (isNaN(insertedLeadId))
            throw new HttpError("DatabaseError", 500, "Lead id not retrieved");

        res.send({ insertedLeadId });
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
routerAppLead.get("/all", TokenValidationRoute, async (req, res, next) => {
    try {
        let leads;

        if (Number(req.query.admin)) {
            leads = await AsyncMysqlQuery(SELECT_ALL_LEAD_QUERY);
        } else {
            leads = await AsyncMysqlQuery(SELECT_USER_LEAD_QUERY, [req.query.userId]);
        }

        res.json(leads);
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
routerAppLead.get("/download", TokenValidationRoute, async (req, res, next) => {
    try {
        let downloadFromUser = req.query.userId;

        let downloadResults;
        if (!downloadFromUser || isNaN(downloadFromUser)) {
            downloadResults = await AsyncMysqlQuery(SELECT_ALL_LEAD_QUERY);
        } else {
            downloadResults = await AsyncMysqlQuery(SELECT_USER_LEAD_QUERY, [downloadFromUser]);
        }

        let fileLocation = XlsxFromJson(downloadResults);

        res.send(fileLocation);
    } catch (err) {
        console.log(err);
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
routerAppLead.get("/results", TokenValidationRoute, async (req, res, next) => {
    try {
        let results = await AsyncMysqlQuery(SELECT_LEADS_RESULTS);
        res.send(results);
    } catch (err) {
        next(err);
    }
});

module.exports = routerAppLead;
