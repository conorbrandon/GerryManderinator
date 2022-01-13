let json = require("./nevada/nv_2020_election.json");

districts = {};

json["features"].forEach(feature => {
	if (districts[feature["properties"]["District"]] === undefined) districts[feature["properties"]["District"]] = {"DemHouVotes": 0, "RepHouVotes": 0};
	districts[feature["properties"]["District"]]["DemHouVotes"] += parseInt(feature["properties"]["G20H" + feature["properties"]["District"] + "DXXX"]);
	districts[feature["properties"]["District"]]["RepHouVotes"] += parseInt(feature["properties"]["G20H" + feature["properties"]["District"] + "RXXX"]);
});
for (const key in districts) {
	const element = districts[key];
	console.log();
	console.log(key, JSON.stringify(element, null, 4));
}