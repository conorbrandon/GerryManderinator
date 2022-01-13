const GeoJsonGeometriesLookup = require("geojson-geometries-lookup");
const fs = require("fs");

[/* "az",  "nv",*/ "ga"].forEach(state => {
    const state_bg = require(`./${state}Bg.json`);
    let glookup = new GeoJsonGeometriesLookup(state_bg);
    let vap = require(`../censusData/georgia/${state}_block_added_vap.json`);
    let blocks = require(`../censusData/georgia/ga_block.json`);

    let vapMap = {};
    vap.features.forEach(feature => {
        vapMap[feature.properties.GEOID20] = feature;
    });

    blocks["features"].forEach((block) => {
        let point = {
            type: "Point",
            coordinates: [
                block["properties"]["INTPTLON20"],
                block["properties"]["INTPTLAT20"],
            ],
        };
        let containers = glookup.getContainers(point);
        if (containers.features[0]) {
            // console.log(containers.features[0]);
            vapMap[block.properties.GEOID20]["properties"].BlockGroup = containers.features[0].properties.GEOID;
            delete vapMap[block.properties.GEOID20].geometry;
    		delete vapMap[block.properties.GEOID20].properties["STATEFP20"];
    		delete vapMap[block.properties.GEOID20].properties["COUNTYFP20"];
    		delete vapMap[block.properties.GEOID20].properties["TRACTCE20"];
    		delete vapMap[block.properties.GEOID20].properties["BLOCKCE20"];
    		delete vapMap[block.properties.GEOID20].properties["NAME20"];
    		delete vapMap[block.properties.GEOID20].properties["MTFCC20"];
    		delete vapMap[block.properties.GEOID20].properties["UR20"];
    		delete vapMap[block.properties.GEOID20].properties["UACE20"];
    		delete vapMap[block.properties.GEOID20].properties["UATYPE20"];
    		delete vapMap[block.properties.GEOID20].properties["FUNCSTAT20"];
    		delete vapMap[block.properties.GEOID20].properties["ALAND20"];
    		delete vapMap[block.properties.GEOID20].properties["AWATER20"];
    		delete vapMap[block.properties.GEOID20].properties["INTPTLAT20"];
    		delete vapMap[block.properties.GEOID20].properties["INTPTLON20"];
        } else {
            console.log("error");
        }
    });

    fs.writeFileSync(
        `./${state}_block_added_vap_and_bg.json`,
        JSON.stringify(vap)
    );
    console.log(state, "done");
});
