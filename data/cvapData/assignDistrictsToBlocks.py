import json
from os import listdir


states = ["ga", "az", "nv"]

for state in states:
    with open("./" + state + "_block_added_vap_and_cvap.json") as g:
        blockNoDistricts = json.load(g)
    with open("../censusData/" + state + "/" + state + "_block.json") as g:
        blockWithGeo = json.load(g)

    blockWithGeoMap = {}
    for block in blockWithGeo["features"]:
        blockWithGeoMap[block["properties"]["GEOID20"]] = block
    
    # print(blockWithGeoMap)

    for block in blockNoDistricts["features"]:
        block["geometry"] = blockWithGeoMap[block["properties"]["GEOID20"]]["geometry"]
        blockWithGeoMap[block["properties"]["GEOID20"]] = block

    onlyfiles = listdir("/Users/school/Desktop/databaseParsing/" + state + "/precincts/")
    # print(blockNoDistricts, onlyfiles)

    for file in onlyfiles:
        with open("/Users/school/Desktop/databaseParsing/" + state + "/precincts/" + file) as g:
            precincts = json.load(g)
        precinctMap = {}
        for precinct in precincts["features"]:
            if precinct["properties"]["COUNTY"] not in precinctMap:
                precinctMap[precinct["properties"]["COUNTY"]] = {}
            precinctMap[precinct["properties"]["COUNTY"]][precinct["properties"]["PCTNUM"]] = precinct["properties"]["District"]

        for block in blockNoDistricts["features"]:
            block["properties"]["District"] = precinctMap[block["properties"]["COUNTY"]][block["properties"]["PCTNUM"]]

        with open("/Users/school/Desktop/databaseParsing/" + state + "/censusBlocks/" + file.split("-")[0] + "-censusBlocks.json", 'w') as outfile:
            json.dump(blockNoDistricts, outfile)

print("success!")