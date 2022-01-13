const shortNameMap = {
    "az": "arizona",
    "ga": "georgia",
    "nv": "nevada"
};
const fs = require("fs");

["az", "ga", "nv"].forEach(state => {
    let election = require(`../../cleanData/${shortNameMap[state]}/${state}_2020_election.json`);
    let census = require(`./${shortNameMap[state]}/${state}_his_pcts.json`);

    election.features.forEach(feature => {
        let elecPctNum  = feature.properties.PCTNUM;
        feature.properties.census = {};
        census.features.forEach(feature2 => {
            let censusPctNum = feature2.properties.PCTNUM;
            if (censusPctNum === elecPctNum) {
                for (const key in feature2.properties) {
                    if (key.includes("TOTAL")) {
                        feature.properties.census[key] = feature2.properties[key];
                    }
                }
            }
        });
    });
    
    const outFileName = `../../cleanData/${shortNameMap[state]}/${state}_elec_hisp_2020.json`;
    fs.writeFileSync(outFileName, JSON.stringify(election, null, 1));
});
