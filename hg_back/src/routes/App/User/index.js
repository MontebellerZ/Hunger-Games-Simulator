const express = require("express");

/**
 * Express Router for Web User related routes.
 * @type {express.Router}
 */
const routerAppUser = express.Router();
const AsyncMysqlQuery = require("../../../utils/AsyncMysqlQuery");
const HttpError = require("../../../errors/HttpError");
const CompareHashString = require("../../../utils/CompareHashString");
const RandomHexHash = require("../../../utils/RandomHexHash");
const SendHtmlEmail = require("../../../utils/SendHtmlEmail");
const ResetPasswordEmail = require("../../../html/ResetPasswordEmail");
const EncryptString = require("../../../utils/EncryptString");
const UserCreatedEmail = require("../../../html/UserCreatedEmail");
const TokenValidationRoute = require("../../../config/TokenValidationRoute");
const TokenCreation = require("../../../config/TokenCreation");
const NewPasswordEmail = require("../../../html/NewPasswordEmail");

const INSERT_USER_QUERY = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
const SELECT_USER_QUERY = `SELECT * FROM users WHERE enabled = TRUE AND email = ?`;
const SELECT_ALL_USER_QUERY = `SELECT u.id, u.name, u.email, u.admin, u.enabled, COUNT(l.id) AS leadsCount FROM users AS u LEFT JOIN leads AS l ON l.user_id = u.id GROUP BY u.id`;
const UPDATE_USER_QUERY = `UPDATE users SET name = ?, email = ?, admin = ?, enabled = ? WHERE id = ?`;
const UPDATE_USER_PASSWORD_QUERY = `UPDATE users SET password = ? WHERE enabled = TRUE AND email = ?`;
const GET_USER_CURRENT = `SELECT id, name, email, admin FROM users WHERE id = ?`

/**
 * Route for user login.
 *
 * @param {express.Request} req - Express Request object.
 * @param {express.Response} res - Express Response object.
 * @param {express.NextFunction} next - Express NextFunction.
 */
routerAppUser.post("/", TokenValidationRoute, async (req, res, next) => {
    try {
        const { name, email } = req.body;

        // validate input
        if (!name || !email)
            throw new HttpError("InvalidInput", 400, "Name and email are required");

        const { hex: randomHexPassword, hash: randomHashPassword } = RandomHexHash(8);

        const resultInsertUser = await AsyncMysqlQuery(INSERT_USER_QUERY, [
            name,
            email,
            randomHashPassword,
        ]).catch((err) => {
            if (err.code === "ER_DUP_ENTRY") {
                throw new HttpError(
                    "DuplicatedEmail",
                    409,
                    `Email "${email}" is already registered`
                );
            }

            throw err;
        });

        const insertedUserId = resultInsertUser.insertId;

        if (isNaN(insertedUserId))
            throw new HttpError("DatabaseError", 500, "User id not retrieved");

        const { subject: emailSubject, body: emailBody } = UserCreatedEmail(
            name,
            email,
            randomHexPassword
        );

        await SendHtmlEmail(email, emailSubject, emailBody);

        const successMessage = `An email was sent to ${name} (${email}) with its credentials and download links.`;
        res.send({
            insertedUserId,
            message: successMessage,
        });
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
routerAppUser.post("/login", async (req, res, next) => {
    try {
        const { login, password } = req.body;

        // validate input
        if (!login || !password)
            throw new HttpError("InvalidInput", 400, "Login and password are required");

        // retrieve user from database
        const resultSelectUser = await AsyncMysqlQuery(SELECT_USER_QUERY, [login]);

        if (!Array.isArray(resultSelectUser))
            throw new HttpError("DatabaseError", 500, "Result is not an array");

        if (resultSelectUser.length !== 1)
            throw new HttpError("InvalidCredentials", 401, "Incorrect login or password");

        // compare password hashes
        const user = resultSelectUser[0];
        const passwordMatches = CompareHashString(password, user.password);

        if (!passwordMatches)
            throw new HttpError("InvalidCredentials", 401, "Incorrect login or password");

        const { token: newToken, expirationTime: newTokenExpiration } = TokenCreation(login);

        user.token = newToken;
        user.tokenExpiration = newTokenExpiration;

        // remove password hash from user object and send response
        delete user.password;
        res.send(user);
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
routerAppUser.patch("/resetPassword", async (req, res, next) => {
    try {
        const { email } = req.body;

        // validate input
        if (!email) throw new HttpError("InvalidInput", 400, "Login is required");

        const { hex: newRandomHexPassword, hash: newRandomHashPassword } = RandomHexHash(8);

        const resultUpdatePassword = await AsyncMysqlQuery(UPDATE_USER_PASSWORD_QUERY, [
            newRandomHashPassword,
            email,
        ]);

        const affectedUsers = resultUpdatePassword.affectedRows;

        if (affectedUsers === 1) {
            const { subject: emailSubject, body: emailBody } =
                ResetPasswordEmail(newRandomHexPassword);

            await SendHtmlEmail(email, emailSubject, emailBody);
        }

        res.send(
            {message: "If the email entered is registered and enabled, your new password will be sent to it."}
        );
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
routerAppUser.patch("/newPassword", TokenValidationRoute, async (req, res, next) => {
    try {
        const email = req.email;
        if (!email) throw "Incorrect token validation";

        const { newPassword } = req.body;

        // validate input
        if (!newPassword) throw new HttpError("InvalidInput", 400, "New password is required");

        const newPasswordHash = EncryptString(newPassword);

        const resultUpdatePassword = await AsyncMysqlQuery(UPDATE_USER_PASSWORD_QUERY, [
            newPasswordHash,
            email,
        ]);

        const affectedUsers = resultUpdatePassword.affectedRows;

        if (affectedUsers === 1) {
            const { subject: emailSubject, body: emailBody } = NewPasswordEmail();

            await SendHtmlEmail(email, emailSubject, emailBody);
        }

        res.send({message: "New password successfully changed"});
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
routerAppUser.patch("/", TokenValidationRoute, async (req, res, next) => {
    try {
        const { id, name, email, admin, enabled } = req.body;

        // validate input
        if (!id || !name || !email || typeof admin !== "boolean" || typeof enabled !== "boolean") {
            throw new HttpError(
                "InvalidInput",
                400,
                "ID, name, email, admin and enable are required"
            );
        }

        const resultUpdatePassword = await AsyncMysqlQuery(UPDATE_USER_QUERY, [
            name,
            email,
            admin,
            enabled,
            id,
        ]).catch((err) => {
            if (err.code === "ER_DUP_ENTRY") {
                throw new HttpError(
                    "DuplicatedEmail",
                    409,
                    `Email "${email}" is already in use by another user`
                );
            }

            throw err;
        });

        const affectedUsers = resultUpdatePassword.affectedRows;

        if (affectedUsers !== 1)
            throw new HttpError("InvalidId", 404, `No user with ID ${id} found.`);

        res.send({message: "User updated successfully"});
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
routerAppUser.get("/all", TokenValidationRoute, async (_req, res, next) => {
    try {
        const resultSelectAllUsers = await AsyncMysqlQuery(SELECT_ALL_USER_QUERY);

        if (!Array.isArray(resultSelectAllUsers))
            throw new HttpError("DatabaseError", 500, "Result is not an array");

        res.send(resultSelectAllUsers);
    } catch (err) {
        next(err);
    }
});

routerAppUser.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params
        const resultSelectUser = await AsyncMysqlQuery(GET_USER_CURRENT, id);

        if (!resultSelectUser)
            throw new HttpError("DatabaseError", 500, "Result is not");

        res.send(resultSelectUser);
    } catch (err) {
        next(err);
    }
});

module.exports = routerAppUser;
