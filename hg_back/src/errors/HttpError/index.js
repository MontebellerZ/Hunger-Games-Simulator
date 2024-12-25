/**
 * A custom error class for HTTP errors.
 */
class HttpError extends Error {
    /**
     * Creates an instance of HttpError.
     * @param {number} code - The error code.
     * @param {number} status - The HTTP status code.
     * @param {string} message - The error message.
     */
    constructor(code, status, message) {
        super(message);

        /**
         * The name of the error.
         * @type {string}
         */
        this.name = "HttpError";

        /**
         * The error code.
         * @type {number}
         */
        this.code = code;

        /**
         * The HTTP status code.
         * @type {number}
         */
        this.status = status;

        /**
         * The error message.
         * @type {string}
         */
        this.message = message;
    }
}

module.exports = HttpError;
