let geo2020 = require("./nevada/2020/nv_2020_election.json");
let geo2018 = require("./nevada/2018/nv_2018_election.json");
let geo2016 = require("./nevada/2016/nv_2016_election.json");
let geoArray = [geo2016, geo2018, geo2020];
let geoPrecincts = [[], [], []]

// const countyMap = {
//     AP: "Apache",
//     CH: "Cochise",
//     CN: "Coconino",
//     GI: "Gila",
//     GM: "Graham",
//     LP: "La Paz",
//     MO: "Mohave",
//     PN: "Pinal",
//     SC: "Santa Cruz",
//     YA: "Yavapai",
//     NA: "Navajo",
//     YU: "Yuma",
//     MC: "Maricopa",
//     PM: "Pima",
//     GN: "Greenlee",
// };
// let countySet = new Set();

/* geo.features.forEach((element) => {
    for (const key in element) {
        if (key == "properties") {
            // element[key]["COUNTY"] = countyMap[element[key]["CDE_COUNTY"]];
            // countySet.add(element[key]["CDE_COUNTY"]);
            // delete element[key]["CDE_COUNTY"];
            // console.log(element[key]);

            // if (!element[key]["CTYNAME"]) console.log(JSON.stringify(element, null, 2));
            // else {
                element[key]["COUNTY"] = element[key]["CTYNAME"] ?
                    element[key]["CTYNAME"].substring(0, 1) +
                    element[key]["CTYNAME"].substring(1).toLowerCase() : null;
                delete element[key]["CTYNAME"];
            // }
        }
    }
}); */

const fs = require('fs');

let i = 0;
let iMap = ["2016", "2018", "2020"]
geoArray.forEach(geo => {
    geo.features.forEach(feature => {
        let properties = feature["properties"];
        geoPrecincts[i].push(properties.PCTNUM);
    });
    geoPrecincts[i].sort();
    console.log(JSON.stringify(geoPrecincts[i], null, 2));
    fs.writeFileSync("/Users/conorbrandon/Desktop/" + i, JSON.stringify(geoPrecincts[i], null, 1));
    i++;
});
geoPrecincts.forEach(geo => console.log(geo.length))
// console.log(JSON.stringify(geo, null, 2));
// console.log(countySet);
