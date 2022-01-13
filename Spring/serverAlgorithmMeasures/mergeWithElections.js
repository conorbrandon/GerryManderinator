const fs = require('fs');

const elections = require('../outDissolvePr.json');
let demographics = require('../outDissolve.json');

demographics.features.forEach(f => {
    elections.features.forEach(f2 => {
        if (f.properties.District !== f2.properties.District) return;
        f.properties = {...f.properties, ...f2.properties};
    });
});
// console.log(JSON.stringify(demographics, null, 1));

fs.writeFileSync('./outDissolve.json', JSON.stringify(demographics));