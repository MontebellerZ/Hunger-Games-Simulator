const RandomHexCode = require("../RandomHexCode");
const EncryptString = require("../EncryptString");

/**
 * Generates a random hexadecimal code and its hash.
 *
 * @async
 * @param {number} [tamanho=10] - The size of the hexadecimal code to be generated. Default is 10.
 * @returns {{hex: string, hash: string}}>} - A Promise that resolves to an object with the generated hexadecimal code and its hash.
 */
const RandomHexHash = (tamanho = 10) => {
    const hex = RandomHexCode(tamanho);
    const hash = EncryptString(hex);

    return { hex, hash };
};

module.exports = RandomHexHash;
