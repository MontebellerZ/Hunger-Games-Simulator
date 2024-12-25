const crypto = require("crypto");

/**
 * Generates a random hex code of a given length.
 *
 * @param {number} [length=10] - The length of the hex code to generate (default is 10).
 * @returns {string} - A string representing the random hex code.
 */
const RandomHexCode = (tamanho = 10) => {
    return crypto.randomBytes(Math.ceil(tamanho / 2)).toString("hex");
};

module.exports = RandomHexCode;
