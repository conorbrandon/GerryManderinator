const GeoJsonGeometriesLookup = require("geojson-geometries-lookup");
const fs = require("fs");

const weirdBlocksGA = {
    // georgia
    "Block 2006": "OLD COURTHOUSE", //
    "Block 2004": "OLD COURTHOUSE",
    "Block 2003": "OLD COURTHOUSE",
    "Block 1002": "unknown6", //
    "Block 1006": "unknown6", //
    "Block 1048": "GUARD HOUSE COMM CTR", //
    "Block 1049": "GUARD HOUSE COMM CTR", //
    "Block 0004": "GUARD HOUSE COMM CTR", //
};
const weirdBlocksNV = {
    // nevada
    "Block 3153": "7412",
    "Block 1215": "7531",
    "Block 1220": "Precinct 4 Crescent Valley Town",
    "Block 1273": "Precinct 3",
    "Block 2131": "ELKO VTD 36 CLOVER VALLEY",
    "Block 2003": "1671", //
    "Block 2004": "1671", //
    "Block 2009": "1671",
    "Block 2220": "1671",
    "Block 2219": "1671",
    "Block 3009": "1074",
    "Block 2008": "1753",
};
const weirdBlocksAZ = {
    // arizona
    "Block 1000": "MO0223", //
    "Block 1138": "CN0071", //
    "Block 4379": "LP0054", //
    "Block 1020": "GI0200", //
    "Block 1001": "MC0266", //
    "Block 2151": "PM0002", //
    "Block 2148": "PM0071", //
};

// const az_pr = require("../electionData/arizona/2020/az_2020_election.json");
// let glookup = new GeoJsonGeometriesLookup(az_pr);
// let blocks = require("./arizona/az_block.json");

// blocks["features"].forEach((block) => {
//     // console.log(block["properties"]["NAME20"]);
//     let point = {
//         type: "Point",
//         coordinates: [
//             block["properties"]["INTPTLON20"],
//             block["properties"]["INTPTLAT20"],
//         ],
//     };
//     let containers = glookup.getContainers(point);
//     if (containers.features[0]) {
//         // console.log(containers.features[0].properties.PCTNUM);
//         block["properties"].PCTNUM = containers.features[0].properties.PCTNUM;
//     } else {
//         block["properties"].PCTNUM = weirdBlocksAZ[block["properties"]["NAME20"]];
//        console.log(block["properties"]["NAME20"], block["properties"].PCTNUM);
//        console.log(JSON.stringify(block.properties), ",");
//     }
// });

// fs.writeFileSync(
//     "./arizona/az_block_with_pr.json",
//     JSON.stringify(blocks, null, 0)
// );

const ga_pr = require("../electionData/georgia/2020/ga_2020_election_house_fixed_2.json");
glookup = new GeoJsonGeometriesLookup(ga_pr);
blocks = require("./georgia/ga_block.json");

eliBlocks = []
countEli = 1
blocks["features"].forEach((block) => {
    // console.log(block["properties"]["NAME20"]);
    let point = {
        type: "Point",
        coordinates: [
            block["properties"]["INTPTLON20"],
            block["properties"]["INTPTLAT20"],
        ],
    };
    let containers = glookup.getContainers(point);
    if (containers.features[0]) {
        // console.log(containers.features[0].properties.PCTNUM);
        block["properties"].PCTNUM = containers.features[0].properties.PCTNUM;
        if (block["properties"].PCTNUM === "ELI WHITNEY COMPLEX 1" || block["properties"].PCTNUM === "ELI WHITNEY COMPLEX 2" ) {
            eliBlocks.push(block);
            console.log(block["properties"].PCTNUM, countEli++);
        }
    } else {
        block["properties"].PCTNUM = weirdBlocksGA[block["properties"]["NAME20"]] || "na";
    //    console.log(block["properties"]["NAME20"], block["properties"].PCTNUM);
    //    console.log(JSON.stringify(block.properties), ",");
    }
});

fs.writeFileSync(
    "./georgia/ga_block_with_pr_eli.json",
    JSON.stringify(eliBlocks, null, 1)
);

// const nv_pr = require("../electionData/nevada/2020/nv_2020_election.json");
// glookup = new GeoJsonGeometriesLookup(nv_pr);
// blocks = require("./nevada/nv_block.json");

// blocks["features"].forEach((block) => {
//     // console.log(block["properties"]["NAME20"]);
//     let point = {
//         type: "Point",
//         coordinates: [
//             block["properties"]["INTPTLON20"],
//             block["properties"]["INTPTLAT20"],
//         ],
//     };
//     let containers = glookup.getContainers(point);
//     if (containers.features[0]) {
//         // console.log(containers.features[0].properties.PCTNUM);
//         block["properties"].PCTNUM = containers.features[0].properties.PCTNUM;
//     } else {
//         block["properties"].PCTNUM = weirdBlocksNV[block["properties"]["NAME20"]];
//        console.log(block["properties"]["NAME20"], block["properties"].PCTNUM);
//        console.log(JSON.stringify(block.properties), ",");
//     }
// });

// fs.writeFileSync(
//     "./nevada/nv_block_with_pr.json",
//     JSON.stringify(blocks, null, 0)
// );
