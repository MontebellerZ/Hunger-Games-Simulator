const jwt = require("jsonwebtoken");

const HASH_EXPIRATION = process.env.HASH_EXPIRATION;
const HASH_CRIPTOGRAFIA = process.env.HASH_CRIPTOGRAFIA;

const TokenCreation = (email) => {
    const token = jwt.sign({ email }, HASH_CRIPTOGRAFIA, {
        expiresIn: HASH_EXPIRATION,
    });
    return { token, expirationTime: HASH_EXPIRATION };
};

module.exports = TokenCreation;
