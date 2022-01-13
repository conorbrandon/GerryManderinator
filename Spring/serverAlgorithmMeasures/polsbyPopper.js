const turfHelpers = require("@turf/helpers");
const turfLength = require("@turf/length");
const turfArea = require("@turf/area");
const fs = require('fs');

const polsbyPopper = async () => {
	let dissolvedDistricts = require(`../outDissolve.json`);

	let polsbyPopperByDistrict = {};
	// https://twitter.com/morganherlocker/status/566105741229305856
	let polsbyPopper = dissolvedDistricts.features.map((feature) => {
		let area = turfArea.default(feature);
		let newCoordinates = [[]];
		if (feature.geometry.type === "MultiPolygon") {
			for (let index = 0; index < feature.geometry.coordinates.length; index++) {
				if (feature.geometry.coordinates[index][0].length > newCoordinates[0].length) newCoordinates = feature.geometry.coordinates[index];
			}
			feature.geometry.coordinates = newCoordinates;
		}
		// console.log(feature.geometry.coordinates[0]);
		let perimeter = turfLength.default(turfHelpers.lineString(feature.geometry.coordinates[0]), { units: 'meters'});
		console.log({ area, perimeter });
		let score = (4 * Math.PI * area) / Math.pow(perimeter, 2);
		polsbyPopperByDistrict[feature.properties.District] = score;
		return score;
	})
	console.log({polsbyPopperByDistrict});
	polsbyPopper = polsbyPopper.reduce((previousValue, currentValue) => previousValue + currentValue) / dissolvedDistricts.features.length;
	console.log({ polsbyPopper });
	fs.appendFileSync('./outMeasures.txt', `polsbyPopperByDistrict ${JSON.stringify(polsbyPopperByDistrict)}\npolsbyPopper ${polsbyPopper}\n`);
};
polsbyPopper();