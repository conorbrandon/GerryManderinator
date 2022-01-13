let json = require("./nevada/nv_dist_elec_and_pop.json");

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const statePop = json["state"]["TOTAL_POP"];
for (const key in json) {
	const district = json[key];
	let distPop = district["TOTAL_POP"];
	district["TOTAL_POP_STRING"] = numberWithCommas(distPop);
	district["TOTAL_POP_PERCENT"] = Math.round(((distPop / statePop) * 100) * 10) / 10;
	if (district["2020_HOUSE_RESULT"] != "na")
	district["2020_HOUSE_RESULT"] = district["2020_HOUSE_RESULT"] === "red" ? "Rep." : "Dem.";
}

console.log(JSON.stringify(json, null, 4));