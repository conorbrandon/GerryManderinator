import csv
import json

for state in [["az", "arizona"], ["ga", "georgia"], ["nv", "nevada"]]:
    # csv file name
    filename = "./" + state[1] + "/" + state[0] + "WithHispanic.csv"

    # initializing the titles and rows list
    fields = []
    rows = []

    # reading csv file
    with open(filename, 'r') as csvfile:
        # creating a csv reader object
        csvreader = csv.reader(csvfile)

        # extracting field names through first row
        fields = next(csvreader)
        dictFields = {}
        for i in range(len(fields)):
            dictFields[fields[i]] = i

        # extracting each data row one by one
        for row in csvreader:
            rows.append(row)

    # printing the field names
    # print(dictFields)

    with open("./" + state[1] + "/" + state[0] + "_block_with_pr_and_pop.json") as f:
        dataCensus = json.load(f)

    censusNameMap = dict()
    for censusBlock in dataCensus["features"]:
        censusNameMap[censusBlock["properties"]["GEOID20"]] = censusBlock
    
    for i in range(1, len(rows)):
        row = rows[i]
        GEO_ID = row[dictFields["GEO_ID"]].split("US")[1]
        DATA = row[dictFields["P2_002N"]]
        censusNameMap[GEO_ID]["properties"]["census"]["TOTAL_HISPANIC"] = int(DATA)
        censusNameMap[GEO_ID]["properties"]["census"]["TOTAL_MIXED"] = censusNameMap[GEO_ID]["properties"]["census"]["TOTAL_POP"] - censusNameMap[GEO_ID]["properties"]["census"]["TOTAL_ONE_RACE"]
        for key in list(censusNameMap[GEO_ID]["properties"]["census"].keys()):
            if "TWO" in key:
                del censusNameMap[GEO_ID]["properties"]["census"][key]
            else:
                censusNameMap[GEO_ID]["properties"][key] = censusNameMap[GEO_ID]["properties"]["census"][key]
        del censusNameMap[GEO_ID]["properties"]["census"]
        # print(GEO_ID, censusNameMap[GEO_ID]["properties"]["census"])

    geojson = {
        "type": "FeatureCollection",
        "crs": {
            "type": "name",
              "properties": {
                "name": "urn:ogc:def:crs:EPSG::4269"
                }
        },
        "features": []
        }
    for k, v in censusNameMap.items():
        geojson["features"].append(v)
    with open("./" + state[1] + "/" + state[0] + "_block_with_pr_and_pop_and_hispanic.json", 'w') as outfile:
        json.dump(geojson, outfile, indent=1)
    
    print(state)