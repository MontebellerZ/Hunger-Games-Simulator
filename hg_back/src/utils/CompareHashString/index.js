const bcryptjs = require("bcryptjs");

/**
 * Compares a plain text string with a hashed string using bcrypt.
 *
 * @param {string} string - The plain text string to compare.
 * @param {string} hash - The hashed string to compare against.
 * @returns {boolean} - True if the strings match, false otherwise.
 */
const CompareHashString = (string, hash) => {
    return bcryptjs.compareSync(string, hash);
};

module.exports = CompareHashString;
