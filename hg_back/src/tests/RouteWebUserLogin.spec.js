const request = require("supertest");
const { app, server } = require("../index");

/**
 * Endpoint for user login
 * @type {string}
 */
const endpointLogin = "/web/user/login";

/**
 * Valid login and password
 * @type {string}
 */
const correctLogin = "27997510809";
const correctSenha = "Dir@2023";

/**
 * Invalid login and password
 * @type {string}
 */
const wrongLogin = "27997510809_";
const wrongSenha = "Directy_";

/**
 * Describes a suite of tests for the "/web/user/login" endpoint
 */
describe(`POST ${endpointLogin}`, () => {
    /**
     * After all tests are completed, closes the server
     */
    afterAll(() => {
        server.close();
    });

    /**
     * Test case for when the login is missing or incorrect
     */
    test("Invalid login should return a 400 error", async () => {
        const response = await request(app).post(endpointLogin).send({ senha: correctSenha });

        expect(response.statusCode).toBe(400);
        expect(response.body.code).toBe("InvalidInput");
        expect(response.body.message).toBe("Login and password are required");
    });

    /**
     * Test case for when the password is missing or incorrect
     */
    test("Invalid password should return a 400 error", async () => {
        const response = await request(app).post(endpointLogin).send({ login: correctLogin });

        expect(response.statusCode).toBe(400);
        expect(response.body.code).toBe("InvalidInput");
        expect(response.body.message).toBe("Login and password are required");
    });

    /**
     * Test case for when the login is incorrect
     */
    test("Incorrect login should return a 401 error", async () => {
        const response = await request(app)
            .post(endpointLogin)
            .send({ login: wrongLogin, senha: correctSenha });

        expect(response.statusCode).toBe(401);
        expect(response.body.code).toBe("InvalidCredentials");
        expect(response.body.message).toBe("Incorrect login or password");
    });

    /**
     * Test case for when the password is incorrect
     */
    test("Incorrect password should return a 401 error", async () => {
        const response = await request(app)
            .post(endpointLogin)
            .send({ login: correctLogin, senha: wrongSenha });

        expect(response.statusCode).toBe(401);
        expect(response.body.code).toBe("InvalidCredentials");
        expect(response.body.message).toBe("Incorrect login or password");
    });

    /**
     * Test case for when the login and password are correct
     */
    test("Valid credentials should return the user object without password", async () => {
        const response = await request(app)
            .post(endpointLogin)
            .send({ login: correctLogin, senha: correctSenha });

        expect(response.statusCode).toBe(200);
        expect(response.body.login).toBe(correctLogin);
        expect(response.body).not.toHaveProperty("senha");
    });
});
