let json = require("../cleanData/georgia/ga_dist_elec_and_pop.json");

let state = {
	"TOTAL_POP": 0,
  "TOTAL_ONE_RACE": 0,
  "TOTAL_ONE_WHITE": 0,
  "TOTAL_ONE_BLACK": 0,
  "TOTAL_ONE_INDIAN": 0,
  "TOTAL_ONE_ASIAN": 0,
  "TOTAL_ONE_PACIFIC": 0,
  "TOTAL_ONE_OTHER": 0,
  "TOTAL_TWO_RACES": 0,
  "TOTAL_TWO_WHITE_BLACK": 0,
  "TOTAL_TWO_WHITE_INDIAN": 0,
  "TOTAL_TWO_WHITE_ASIAN": 0,
  "TOTAL_TWO_WHITE_PACIFIC": 0,
  "TOTAL_TWO_WHITE_OTHER": 0,
  "TOTAL_TWO_BLACK_INDIAN": 0,
  "TOTAL_TWO_BLACK_ASIAN": 0,
  "TOTAL_TWO_BLACK_PACIFIC": 0,
  "TOTAL_TWO_BLACK_OTHER": 0,
  "TOTAL_TWO_INDIAN_ASIAN": 0,
  "TOTAL_TWO_INDIAN_PACIFIC": 0,
  "TOTAL_TWO_INDIAN_OTHER": 0,
  "TOTAL_TWO_ASIAN_PACIFIC": 0,
  "TOTAL_TWO_ASIAN_OTHER": 0,
  "TOTAL_TWO_PACIFIC_OTHER": 0,
  "2020_HOUSE_RESULT": "na"
}

for (const district in json) {
	const element = json[district];
	for (const prop in element) {
		if (prop === "2020_HOUSE_RESULT") continue;
		state[prop] += element[prop];
	}
}
console.log(JSON.stringify(state));