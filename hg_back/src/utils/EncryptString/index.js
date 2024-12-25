const bcrypt = require("bcryptjs");

/**
 * Generates a hashed string using the bcrypt algorithm with a cost factor of 10.
 *
 * @async
 * @param {string} stringToHash - The string to be hashed.
 * @returns {string} - A promise that resolves with the hashed string.
 * @throws {Error} - If an error occurs while generating the hash.
 */
const EncryptString = (stringToHash) => {
    try {
        return bcrypt.hashSync(stringToHash, 10);
    } catch (error) {
        throw error;
    }
};

module.exports = EncryptString;
