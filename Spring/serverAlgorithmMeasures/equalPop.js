const fs = require('fs');

const equalPop = async () => {

	// get the district plan we are processing
	let districtPlan = require(`../outDissolve.json`);

	const stateDistrictColors = {
		9: ['', 'red', 'blue', 'green', 'orange', 'yellow', 'purple', 'darkgrey', 'aqua', 'black'],
		14: ['', 'lime', 'purple', 'deeppink', 'red', 'mediumblue', 'greenyellow', 'black', 'yellow', 'orange', 'aqua', 'darkgrey', 'pink', 'teal', 'lightcoral'],
		4: ['', 'blue', 'orange', 'red', 'green']
	}

	// find total pop of state
	let totalStatePop = 0;
	let max = Number.MIN_SAFE_INTEGER;
	let min = Number.MAX_SAFE_INTEGER;
	districtPlan["features"].forEach(feature => {
		let { properties } = feature;
		let { TOTAL_POP } = properties;
		totalStatePop += TOTAL_POP;
		if (TOTAL_POP < min) min = TOTAL_POP;
		if (TOTAL_POP > max) max = TOTAL_POP;
	});
	// calculate ideal district pop
	let idealDistrictPop = totalStatePop / districtPlan.features.length;
	console.log({max, min, idealDistrictPop});
	const equalPopScore = (max - min) / idealDistrictPop;

	// for equal population variance score
	let opportunityDistrictGroups = {};
	districtPlan["features"].forEach(feature => {
		let { properties } = feature;
		let {
			TOTAL_POP, 
			TOTAL_ONE_BLACK, TOTAL_ONE_INDIAN, 
			TOTAL_ONE_ASIAN, TOTAL_HISPANIC, District
		} = properties;

		TOTAL_POP = parseInt(TOTAL_POP);
		TOTAL_ONE_BLACK = parseInt(TOTAL_ONE_BLACK);
		TOTAL_ONE_INDIAN = parseInt(TOTAL_ONE_INDIAN);
		TOTAL_ONE_ASIAN = parseInt(TOTAL_ONE_ASIAN);
		TOTAL_HISPANIC = parseInt(TOTAL_HISPANIC);

		opportunityDistrictGroups[District] = [];
		if (TOTAL_ONE_BLACK / TOTAL_POP >= .5) { opportunityDistrictGroups[District].push("BLACK"); } // console.log(TOTAL_ONE_BLACK / TOTAL_POP);
		if (TOTAL_ONE_INDIAN / TOTAL_POP >= .5) { opportunityDistrictGroups[District].push("INDIAN"); } // console.log(TOTAL_ONE_INDIAN / TOTAL_POP);
		if (TOTAL_ONE_ASIAN / TOTAL_POP >= .5) { opportunityDistrictGroups[District].push("ASIAN"); } // console.log(TOTAL_ONE_ASIAN / TOTAL_POP);
		if (TOTAL_HISPANIC / TOTAL_POP >= .5) { opportunityDistrictGroups[District].push("HISPANIC"); } // console.log(TOTAL_HISPANIC / TOTAL_POP);

		feature.properties.featureColor = stateDistrictColors[districtPlan.features.length][parseInt(District)];
	});

	console.log({ equalPopScore });

	fs.writeFileSync(`./outDissolve.json`, JSON.stringify(districtPlan));
	fs.appendFileSync('./outMeasures.txt', `equalPopScore ${equalPopScore}\nopportunityDistrictGroups ${JSON.stringify(opportunityDistrictGroups)}\n`);
};
equalPop();