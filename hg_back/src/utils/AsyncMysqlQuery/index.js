const MysqlConnection = require("../../config/MysqlConnection");

/**
 * Executes an asynchronous MySQL query using the provided query and arguments.
 *
 * @param {string} query - The SQL query to be executed.
 * @param {(number|string|Date)[]} queryArguments - Optional array of arguments to be used in the query.
 * @returns {Promise<Object[]|Object>} - A Promise object that resolves to the query result or rejects with an error object.
 */
const AsyncMysqlQuery = async (query, queryArguments = []) => {
    return new Promise((resolve, reject) => {
        const connection = MysqlConnection();

        /**
         * Executes the provided query using the MysqlConnection object and calls the callback function with the query result or error object.
         */
        connection.query(query, queryArguments, (err, result) => {
            connection.end();

            if (err) return reject(err);
            return resolve(result);
        });
    });
};

module.exports = AsyncMysqlQuery;
