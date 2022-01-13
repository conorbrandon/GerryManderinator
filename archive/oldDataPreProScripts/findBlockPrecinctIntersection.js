const intersect = require("@turf/intersect");
const area = require("@turf/area");
const fs = require("fs");

const precincts = require("../../../gerry-mcmc-v2/scripts/makeRebuildIDMaps/ga-remade-fc.json");
let blocks = require("./georgia/ga_block.json");

// function makeArray(d1, d2) {
//     var arr = [];
//     for(let i = 0; i < d2; i++) {
//         arr.push(new Array(d1));
//     }
//     return arr;
// }
// let intersection = makeArray(blocks.features.length, precincts.features.length);

for (let b = 0; b < blocks.features.length; b++) {
    const block = blocks.features[b];
    for (let p = 0; p < precincts.features.length; p++) {
        const precinct = precincts.features[p];
        let int = intersect.default(block, precinct);
        // intersection[b][p] = int !== null ? area.default(int) : 0; 
        let ar = int !== null ? area.default(int) : 0;
        if (ar) {
            console.log(ar, block.properties.GEOID20, precinct.properties.PCTNUM);
            blocks.features[b].properties.PCTNUM = precinct.properties.PCTNUM;
            break;
        }
    }
    delete blocks.features[b].geometry;
}
// console.log(JSON.stringify(intersection));

// for (let b = 0; b < blocks.features.length; b++) {
//     let maxOverlap = 0;
//     let maxPrecinct = "";
//     for (let p = 0; p < precincts.features.length; p++) {
//         const precinct = precincts.features[p];
//         if (intersection[b][p] > maxOverlap) {
//             maxOverlap = intersection[b][p];
//             maxPrecinct = precinct.properties.PCTNUM;
//         }
//     }
//     blocks.features[b].properties.PCTNUM = maxPrecinct;
//     console.log(blocks.features[b].properties.GEOID20, blocks.features[b].properties.PCTNUM)
// }
fs.writeFileSync("./ga-redo-pr-pop.json", JSON.stringify(blocks, null, 1));

