const fs = require("fs");

// let azGeo2020 = require("./arizona/2020/az_2020_parsed.json");
// let azGeo2018 = require("./arizona/2018/az_2018_parsed.json");
// let azGeo2016 = require("./arizona/2016/az_2016_parsed.json");

// let nvGeo2020 = require("./nevada/2020/nv_2020_parsed.json");
// let nvGeo2018 = require("./nevada/2018/nv_2018_parsed.json");
// let nvGeo2016 = require("./nevada/2016/nv_2016_parsed.json");

// let gaGeo2020 = require("./georgia/2020/ga_2020_parsed.json");
// let gaGeo2018 = require("./georgia/2018/ga_2018_parsed.json");
// let gaGeo2016 = require("./georgia/2016/ga_2016_parsed.json");

const mappingFileNames = {
    azGeo2020: "./arizona/2020/az_2020_parsed.json",
    azGeo2018: "./arizona/2018/az_2018_parsed.json",
    azGeo2016: "./arizona/2016/az_2016_parsed.json",
    nvGeo2020: "./nevada/2020/nv_2020_parsed.json",
    nvGeo2018: "./nevada/2018/nv_2018_parsed.json",
    nvGeo2016: "./nevada/2016/nv_2016_parsed.json",
    gaGeo2020: "./georgia/2020/ga_2020_parsed.json",
    gaGeo2018: "./georgia/2018/ga_2018_parsed.json",
    gaGeo2016: "./georgia/2016/ga_2016_parsed.json",
};

for (const key in mappingFileNames) {
    let geo = require(mappingFileNames[key]);

    geo.features.forEach((element) => {
        let properties = element["properties"];
        let USSR, USSD, ATGR, ATGD, PRER, PRED, HOUR, HOUD, matches;
        let totalD = totalR = 0;
        for (const key2 in properties) {
            if ((matches = key2.match(/.{6,6}([DR]).{3,3}/))) {
                if (matches[1] === "R") totalR += properties[key2];
                else if (matches[1] === "D") totalD += properties[key2];
            }
            if ((matches = key2.match(/.{3,3}PRE([DR]).{3,3}/))) {
                if (matches[1] === "R") PRER = properties[key2];
                else if (matches[1] === "D") PRED = properties[key2];
            }
            if ((matches = key2.match(/.{3,3}USS([DR]).{3,3}/))) {
                if (matches[1] === "R") USSR = properties[key2];
                else if (matches[1] === "D") USSD = properties[key2];
            }
            if ((matches = key2.match(/.{3,3}ATG([DR]).{3,3}/))) {
                if (matches[1] === "R") ATGR = properties[key2];
                else if (matches[1] === "D") ATGD = properties[key2];
            }
            if ((matches = key2.match(/.{3,3}H\d+([DR]).{3,3}/))) {
                if (matches[1] === "R") HOUR = properties[key2];
                else if (matches[1] === "D") HOUD = properties[key2];
            }
        }
        if (PRER != undefined && PRED != undefined && PRER > PRED)
            properties["PREColor"] = "red";
        else if (PRER != undefined && PRED != undefined && PRED > PRER)
            properties["PREColor"] = "blue";
        else if (PRER != undefined && PRED != undefined && PRED === PRER && (PRED + PRER) != 0)
            properties["PREColor"] = "purple";
        else if (PRER != undefined && PRED != undefined && (PRED + PRER) === 0) 
            properties["PREColor"] = "gray";
        else properties["PREColor"] = "transparent";

        if (USSR != undefined && USSD != undefined && USSR > USSD)
            properties["USSColor"] = "red";
        else if (USSR != undefined && USSD != undefined && USSD > USSR)
            properties["USSColor"] = "blue";
        else if (USSR != undefined && USSD != undefined && USSD === USSR && (USSD + USSR) != 0)
            properties["USSColor"] = "purple";
        else if (USSR != undefined && USSD != undefined && (USSD + USSR) === 0) 
            properties["USSColor"] = "gray";
        else properties["USSColor"] = "transparent";

        if (ATGR != undefined && ATGD != undefined && ATGR > ATGD)
            properties["ATGColor"] = "red";
        else if (ATGR != undefined && ATGD != undefined && ATGD > ATGR)
            properties["ATGColor"] = "blue";
        else if (ATGR != undefined && ATGD != undefined && ATGD === ATGR && (ATGD + ATGR) != 0)
            properties["ATGColor"] = "purple";
        else if (ATGR != undefined && ATGD != undefined && (ATGD + ATGR) === 0) 
            properties["ATGColor"] = "gray";
        else properties["ATGColor"] = "transparent";

        if (totalR > totalD) properties["overallPartyPreference"] = "R";
        if (totalD > totalR) properties["overallPartyPreference"] = "D";
        if (totalR === totalD) properties["overallPartyPreference"] = "";

        // console.log(properties);
    });

    let outFilePath = mappingFileNames[key].replace(/parsed/, "election");
    console.log(outFilePath);
    fs.writeFileSync(outFilePath, JSON.stringify(geo, null, 2));
}
