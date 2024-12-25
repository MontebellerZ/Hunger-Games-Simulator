const fs = require("fs");
const HttpError = require("../../errors/HttpError");

/**
 * Writes the error stack to the error log file of the day.
 *
 * @param {HttpError} error - The HttpError object to be logged.
 * @throws {Error} - If an error occurs while writing the error log file.
 */
const WriteErrorLog = (error) => {
    // Get today's date and time
    const dateToday = new Date();

    const dayToday = dateToday.getDate().toString().padStart(2, "0");
    const monthToday = (dateToday.getMonth() + 1).toString().padStart(2, "0");
    const yearToday = dateToday.getFullYear().toString();
    const fullDateString = yearToday + monthToday + dayToday; // Format: yyyyMMdd

    const hourToday = dateToday.getHours().toString().padStart(2, "0");
    const minuteToday = dateToday.getMinutes().toString().padStart(2, "0");
    const secondToday = dateToday.getSeconds().toString().padStart(2, "0");
    const fullTimeString = `${hourToday}:${minuteToday}:${secondToday}`; // Format: hh:mm:ss

    // Create the folder for error log files if it doesn't exist
    const errorLogFilesFolderPath = "./src/logs/errors/";
    if (!fs.existsSync(errorLogFilesFolderPath))
        fs.mkdirSync(errorLogFilesFolderPath, { recursive: true });

    // Define the path to today's error log file and check for its existence
    const todayErrorFileName = fullDateString + "_error_log.txt";
    const completeErrorLogFilePath = errorLogFilesFolderPath + todayErrorFileName;

    // Define the log to be written
    const errorLog = error.stack;
    const timeLogWithJump = `*** ${fullTimeString} ***\n`;
    const completeErrorLog = "\n" + timeLogWithJump + errorLog + "\n";

    // Write to file
    try {
        fs.writeFileSync(completeErrorLogFilePath, completeErrorLog, {
            flag: "a",
            encoding: "utf8",
        });
    } catch (error) {
        throw new Error("An error occurred while writing the error log file.");
    }
};

module.exports = WriteErrorLog;
