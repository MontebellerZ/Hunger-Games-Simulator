const XLSX = require("xlsx");
const path = require("path");

const XlsxFromJson = (jsonContent, fileName = "downloadFile") => {
    const jsonDatagrid = jsonContent;

    const ws = XLSX.utils.json_to_sheet(jsonDatagrid);

    const timestampNow = new Date().valueOf();

    const fullFileName = `${timestampNow}_${fileName}.xlsx`;

    const pathLocation = "/public/results/";

    const fullPathLocation = path.join("./", pathLocation);

    const fileLocation = path.join(pathLocation, fullFileName);

    const fullFileLocation = path.join(fullPathLocation, fullFileName);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Results");

    XLSX.writeFile(wb, fullFileLocation, {
        bookType: "xlsx",
        type: "array",
    });

    return fileLocation;
};

module.exports = XlsxFromJson;
