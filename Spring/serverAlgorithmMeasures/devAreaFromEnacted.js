const fs = require('fs');

const turfArea = require("@turf/area");
const turfIntersect = require("@turf/intersect");

const devAreaFromEnacted = async (state) => {
    console.log({ state });
    let enactedDistricts = require(`../src/main/js/assets/${state}-districts.json`);
    let dissolvedDistricts = require(`../outDissolve.json`);

    dissolvedDistricts.features.sort((a, b) => parseInt(a.properties.District) < parseInt(b.properties.District) ? -1 : 1);
    enactedDistricts.features.sort((a, b) => parseInt(a.properties.District) < parseInt(b.properties.District) ? -1 : 1);

    let districtIntersections = [];
    let stateArea = 0;
    for (let i = 0; i < dissolvedDistricts.features.length; i++) {
        const feature = dissolvedDistricts.features[i];
        districtIntersections.push([]);
        stateArea += turfArea.default(feature);
        for (let j = 0; j < enactedDistricts.features.length; j++) {
            const feature2 = enactedDistricts.features[j];
            let intersection = turfIntersect.default(feature, feature2);
            let area = !intersection ? 0 : turfArea.default(intersection);
            districtIntersections[i].push(area);
        }
    }
    console.log({ districtIntersections });

    let sumIntersectionArea = 0;
    for (let index = 0; index < districtIntersections.length; index++) {
        sumIntersectionArea += Math.max(...districtIntersections[index]);
    }
    let devEnactedArea = sumIntersectionArea / stateArea;
    console.log({ devEnactedArea });

    fs.appendFileSync('./outMeasures.txt', `devEnactedArea ${devEnactedArea}\n`);
};

devAreaFromEnacted(process.argv[2]);