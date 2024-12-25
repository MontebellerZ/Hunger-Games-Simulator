const PRODUCTION_ARGUMENT = "--production";

const UseProductionConnection = () => {
    let arguments = process.argv.slice(2);

    return arguments.includes(PRODUCTION_ARGUMENT);
};

module.exports = UseProductionConnection;
