const mysql = require("mysql");
const UseProductionConnection = require("../../utils/UseProductionConnection");

const USE_PROD = UseProductionConnection();

// Get MySQL connection settings from environment variables
const MYSQL_CONNECTION_LIMIT = process.env.MYSQL_CONNECTION_LIMIT;
const MYSQL_HOST = process.env.MYSQL_HOST;
const MYSQL_PORT = process.env.MYSQL_PORT;
const MYSQL_USER = USE_PROD ? process.env.MYSQL_PROD_USER : process.env.MYSQL_TEST_USER;
const MYSQL_PASSWORD = USE_PROD ? process.env.MYSQL_PROD_PASSWORD : process.env.MYSQL_TEST_PASSWORD;
const MYSQL_DATABASE = USE_PROD ? process.env.MYSQL_PROD_DATABASE : process.env.MYSQL_TEST_DATABASE;

/**
 * Creates a connection pool for a MySQL database.
 *
 * @returns {mysql.Pool} The connection pool for the MySQL database.
 */
const MysqlConnection = () => {
    // Create a new MySQL connection pool using the settings from the environment variables
    const con = mysql.createPool({
        connectionLimit: MYSQL_CONNECTION_LIMIT,
        host: MYSQL_HOST,
        port: MYSQL_PORT,
        user: MYSQL_USER,
        password: MYSQL_PASSWORD,
        database: MYSQL_DATABASE,
    });
    return con;
};

module.exports = MysqlConnection;
