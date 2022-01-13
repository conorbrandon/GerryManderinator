const fs = require("fs");

const mappingFileNames = {
    azGeo2020: "./arizona/2020/az_2020_election_house_fixed.json",
    nvGeo2020: "./nevada/2020/nv_2020_election_house_fixed.json",
    gaGeo2020: "./georgia/2020/ga_2020_election_house_fixed.json",
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

        if (HOUR != undefined && HOUD != undefined && HOUR > HOUD)
            properties["HOUColor"] = "red";
        else if (HOUR != undefined && HOUD != undefined && HOUD > HOUR)
            properties["HOUColor"] = "blue";
        else if (HOUR != undefined && HOUD != undefined && HOUD === HOUR && (HOUD + HOUR) != 0)
            properties["HOUColor"] = "purple";
        else if (HOUR != undefined && HOUD != undefined && (HOUD + HOUR) === 0) 
            properties["HOUColor"] = "gray";
        else properties["HOUColor"] = "transparent";

        if (totalR > totalD) { 
            properties["overallPartyPreference"] = "R"; 
        }
        if (totalD > totalR) { 
            properties["overallPartyPreference"] = "D"; 
        }
        if (totalR === totalD) { 
            properties["overallPartyPreference"] = ""; 
        }
        properties["overallD"] = totalD; 
        properties["overallR"] = totalR; 

        // console.log(properties);
    });

    let outFilePath = mappingFileNames[key].replace(/election_house_fixed/, "election_house_fixed_2");
    console.log(outFilePath);
    fs.writeFileSync(outFilePath, JSON.stringify(geo, null, 2));
}
