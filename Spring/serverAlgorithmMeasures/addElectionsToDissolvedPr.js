const fs = require('fs');

const precincts = require(`../src/main/resources/precincts-geojson/${process.argv[2]}.json`);
let precinctMap = {};
precincts.features.forEach(feature => {
    const { PCTNUM, COUNTY,
        ATG18D, ATG18R,
        HOU20D, HOU20R,
        USS18D, USS18R,
        USS20D, USS20R,
        PRE20D, PRE20R,
        TOTAL_POP
    } = feature.properties;
    if (!precinctMap[COUNTY]) precinctMap[COUNTY] = {};
    precinctMap[COUNTY][PCTNUM] = {
        ATG18D, ATG18R,
        HOU20D, HOU20R,
        USS18D, USS18R,
        USS20D, USS20R,
        PRE20D, PRE20R,
        TOTAL_POP
    };
});
// console.log({ precinctMap }, Object.keys(precinctMap).length);

let dissolvedPr = require(`../outDissolvePr.json`);
dissolvedPr.features.forEach(pr => {
    const { TOTAL_POP, PCTNUM, COUNTY } = pr.properties;
    const foundFeature = precinctMap[COUNTY][PCTNUM];
    const totalPrPop = precinctMap[COUNTY][PCTNUM].TOTAL_POP;
    for (const electionBasis in foundFeature) {
        const electionResult = foundFeature[electionBasis];
        if (electionBasis === "TOTAL_POP") {
            continue;
        } else if (electionResult === undefined) {
            pr.properties[electionBasis] = null;
            continue;
        }
        // console.log({electionResult, TOTAL_POP, totalPrPop, electionBasis});
        pr.properties[electionBasis] = totalPrPop > 0 ? electionResult * (TOTAL_POP / totalPrPop) : 0;
        pr.properties[electionBasis] = parseInt(pr.properties[electionBasis].toFixed(0));
    }
    // console.log(pr.properties);
});

fs.writeFileSync(`./outDissolvePr.json`, JSON.stringify(dissolvedPr, null, 1));