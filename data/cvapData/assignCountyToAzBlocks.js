const blocks = require("./az_block_added_vap_and_cvap.json");
const fs = require('fs');

let blocksMap = {
    'AP': 'Apache',
    'NA': 'Navajo',
    'GM': 'Graham',
    'CH': 'Cochise',
    'CN': 'Coconino',
    'MO': 'Mohave',
    'GI': 'Gila',
    'GN': 'Greenlee',
    'LP': 'La Paz',
    'MC': 'Maricopa',
    'YA': 'Yavapai',
    'PM': 'Pima',
    'PN': 'Pinal',
    'SC': 'Santa Cruz',
    'YU': 'Yuma'
  };
for (let i = 0; i < blocks.features.length; i++) {
    const element = blocks.features[i];
    element.properties.COUNTY = blocksMap[element.properties.PCTNUM.substr(0, 2)];
}
fs.writeFileSync("./az_block_added_county.json", JSON.stringify(blocks));