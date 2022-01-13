import json

stateIndexMap = {0: ["arizona", "az"], 1: [
    "georgia", "ga"], 2: ["nevada", "nv"]}

for i in range(0, 3):
    with open('./' + stateIndexMap[i][0] + '/2020/' + stateIndexMap[i][1] + '_2020_election.json') as f:
        dataElection = json.load(f)
    with open('./matchedPr' + stateIndexMap[i][1].upper() + '.json') as f:
        dataMapping = json.load(f)
    with open('./' + stateIndexMap[i][0] + '/2020/' + stateIndexMap[i][1] + '_pr_house.json') as f:
        dataHouse = json.load(f)

    for county, precincts in dataHouse.items():
        for precinct in precincts:
            dem = dataHouse[county][precinct]["D"]
            rep = dataHouse[county][precinct]["R"]
            print(county, precinct, dataHouse[county][precinct])
            dist = dataHouse[county][precinct]["District"]
            precinctElec = dataMapping[county][precinct]
            for precinct2 in dataElection["features"]:
                if precinct2["properties"]["COUNTY"] == county and precinct2["properties"]["PCTNUM"] == precinctElec:
                    precinct2["properties"]["G20H" + format(int(dist), "02d") + "DXXX"] = dem
                    precinct2["properties"]["G20H" + format(int(dist), "02d") + "RXXX"] = rep
                    precinct2["properties"]["District"] = format(int(dist), "02d")
                    print(precinct2["properties"])
                    print()
    with open('./' + stateIndexMap[i][0] + '/2020/' + stateIndexMap[i][1] + '_2020_election_house_fixed.json', 'w') as outfile:
        json.dump(dataElection, outfile, indent=1)
