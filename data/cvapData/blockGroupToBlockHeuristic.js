const fs = require('fs');
const csv = require('csv-parser');

let states = [["az", "arizona", "04"], ["ga", "georgia", "13"], ["nv", "nevada", "32"]];

const cvapNamesMap = {
    total: 'CVAP_TOTAL_POP',
    hispanic: 'CVAP_TOTAL_HISPANIC',
    white: 'CVAP_TOTAL_ONE_WHITE',
    black: 'CVAP_TOTAL_ONE_BLACK',
    indian: 'CVAP_TOTAL_ONE_INDIAN',
    asian: 'CVAP_TOTAL_ONE_ASIAN',
    pacific: 'CVAP_TOTAL_ONE_PACIFIC'
};
states.forEach(state => {
    let blocks = require(`./${state[0]}_block_added_vap_and_bg.json`);
    let blockGroups = {};
    blocks.features.forEach(feature => {
        let { BlockGroup } = feature.properties;
        if (!blockGroups[BlockGroup]) blockGroups[BlockGroup] = {
            blocks: [],
            totalPop: 0
        };
        blockGroups[BlockGroup].blocks.push(feature);
        blockGroups[BlockGroup].totalPop += feature.properties.VAP_TOTAL_POP;
    });
    // console.log(JSON.stringify(blockGroups, null, 2));

    let count = 0;
    let geojson = { "type": "FeatureCollection", "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:EPSG::4269" } }, "features": [] };
    fs.createReadStream('./cvapBgParsed.csv')
        .pipe(csv())
        .on('data', function (row) {
            if (row.geoid.substr(0, 2) == state[2]) {
                if (!blockGroups[row.geoid]) console.log(row.geoid, blockGroups[row.geoid]);
                else {
                    console.log(row, ++count);
                    for (let b = 0; b < blockGroups[row.geoid].blocks.length; b++) {
                        let block = blockGroups[row.geoid].blocks[b];
                        let blockPercentageOfGroup = blockGroups[row.geoid].totalPop > 0 ? block.properties.VAP_TOTAL_POP / blockGroups[row.geoid].totalPop : 0;
                        // console.log({ blockPercentageOfGroup });
                        for (basis in row) {
                            if (basis === "geoid") continue;
                            if (blockPercentageOfGroup) {
                                block.properties[cvapNamesMap[basis]] = parseFloat((blockPercentageOfGroup * parseInt(row[basis])).toFixed(3));
                            } else {
                                block.properties[cvapNamesMap[basis]] = 0;
                            }
                        }
                        delete block.properties.BlockGroup;
                        // console.log(block);
                        geojson.features.push(block);
                    }
                }
            }
        }).on('end', function () {
            // console.log(JSON.stringify(geojson, null, 1));
            fs.writeFileSync(
                `./${state[0]}_block_added_vap_and_cvap.json`,
                JSON.stringify(geojson)
            );
        });
});