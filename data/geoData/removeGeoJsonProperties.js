const geo = require("./districts114.json");

let i = 0;
let newGeo = {
    type: 'FeatureCollection',
    crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:EPSG::4269' } },
    features: []
};
geo.features.forEach((element) => {
    for (const key in element) {
        if (key == "properties" && (element[key].STATENAME === "Arizona" || element[key].STATENAME === "Georgia" || element[key].STATENAME === "Nevada")) {
            // console.log(i, element[key]);
            element[key] = {"STATENAME": element[key].STATENAME, "DISTRICT": element[key].DISTRICT};
            newGeo.features.push(element);
        }
        i++;
    }
});

console.log(JSON.stringify(newGeo, null, 4));
// console.log(newGeo);