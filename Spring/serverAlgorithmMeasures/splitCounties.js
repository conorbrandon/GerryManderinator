const fs = require('fs');

const splitCounties = async () => {
    let districtPlan = require(`../outDissolvePr.json`);

    let countyDistrict = {};    // simply counting the number of districts that contain this county
    let districtCounty = {}     // used to do COUNTIES_IN_DISTRICTS column of db
    districtPlan.features.forEach(feature => {
        let { COUNTY, District } = feature.properties;

        if (!countyDistrict[COUNTY]) countyDistrict[COUNTY] = new Set();
        countyDistrict[COUNTY].add(District);

        if (!districtCounty[District]) districtCounty[District] = new Set();
        districtCounty[District].add(COUNTY);
    });
    for (District in districtCounty) {
        districtCounty[District] = Array.from(districtCounty[District]);
    }

    let totalSplitCounties = 0;
    for (const key in countyDistrict) {
        if (countyDistrict[key].size >= 2) {
            totalSplitCounties++;
        }
    }
    // districtCounty {"1":["Clark"],"2":["Clark","Nye","Lincoln"],"3":["Clark","Churchill","Mineral","Washoe","Esmeralda","Lyon","Nye","Elko","White Pine","Pershing","Eureka","Humboldt","Lander","Lincoln"],"4":["Washoe","Churchill","Lyon","Douglas","Mineral","Carson City","Esmeralda","Storey","Nye","Humboldt","Pershing","Lander"]}
    districtCountyParsed = {};
    for (const district in districtCounty) {
        districtCountyParsed[district] = new Set();
        districtCounty[district].forEach(county => {
            for (const district2 in districtCounty) {
                districtCounty[district2].forEach(county2 => {
                    if (county === county2) {
                        districtCountyParsed[district].add(county2);
                    }
                });
            }
        });
        districtCountyParsed[district] = districtCountyParsed[district].size;
    }
    const splitCountiesByDistrict = districtCountyParsed;

    console.log({ totalSplitCounties, splitCountiesByDistrict });
    fs.appendFileSync('./outMeasures.txt', `totalSplitCounties ${totalSplitCounties}\nsplitCountiesByDistrict ${JSON.stringify(splitCountiesByDistrict)}\n`);
};

splitCounties();