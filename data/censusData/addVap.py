import csv
import json

for state in [["nv", "nevada"], ["az", "arizona"], ["ga", "georgia"]]:

    if state[0] == "az":
        censusFile = "az_block_with_pr_and_pop_and_hispanic.json"
    else:
        censusFile = state[0] + "_block_with_pr_and_pop-wow.json"
    with open("./" + state[1] + "/" + censusFile) as f:
        dataCensus = json.load(f)
    with open("./" + state[1] + "/" + state[0] + "_block.json") as g:
        blockGeography = json.load(g)
    
    blockGeographyNameMap = dict()
    for censusBlock in blockGeography["features"]:
        blockGeographyNameMap[censusBlock["properties"]["GEOID20"]] = censusBlock["geometry"]

    censusNameMap = dict()
    for censusBlock in dataCensus["features"]:
        censusNameMap[censusBlock["properties"]["GEOID20"]] = censusBlock
        censusNameMap[censusBlock["properties"]["GEOID20"]]["geometry"] = blockGeographyNameMap[censusBlock["properties"]["GEOID20"]]

    # csv file name
    filename = "./" + state[1] + "/" + state[0] + "Vap.csv"

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

    # csv file name
    filename = "./" + state[1] + "/" + state[0] + "VapHispanic.csv"

    # initializing the titles and rows list
    fieldsHispanic = []
    rowsHispanic = []

    # reading csv file
    with open(filename, 'r') as csvfile:
        # creating a csv reader object
        csvreader = csv.reader(csvfile)

        # extracting field names through first row
        fieldsHispanic = next(csvreader)
        dictFieldsHispanic = {}
        for i in range(len(fieldsHispanic)):
            dictFieldsHispanic[fieldsHispanic[i]] = i

        # extracting each data row one by one
        for row in csvreader:
            rowsHispanic.append(row)

    # printing the field names
    # print(dictFieldsHispanic)
    
    for i in range(1, len(rows)):
        row = rows[i]
        GEO_ID = row[dictFields["GEO_ID"]].split("US")[1]

        censusNameMap[GEO_ID]["properties"]["BlockGroup"] = int(row[dictFields["NAME"]].split("Block Group ")[1][0])
        censusNameMap[GEO_ID]["properties"]["VAP_TOTAL_POP"] = int(row[dictFields["P3_001N"]])
        censusNameMap[GEO_ID]["properties"]["VAP_TOTAL_ONE_RACE"] = int(row[dictFields["P3_002N"]])
        censusNameMap[GEO_ID]["properties"]["VAP_TOTAL_ONE_WHITE"] = int(row[dictFields["P3_003N"]])
        censusNameMap[GEO_ID]["properties"]["VAP_TOTAL_ONE_BLACK"] = int(row[dictFields["P3_004N"]])
        censusNameMap[GEO_ID]["properties"]["VAP_TOTAL_ONE_INDIAN"] = int(row[dictFields["P3_005N"]])
        censusNameMap[GEO_ID]["properties"]["VAP_TOTAL_ONE_ASIAN"] = int(row[dictFields["P3_006N"]])
        censusNameMap[GEO_ID]["properties"]["VAP_TOTAL_ONE_PACIFIC"] = int(row[dictFields["P3_007N"]])
        censusNameMap[GEO_ID]["properties"]["VAP_TOTAL_ONE_OTHER"] = int(row[dictFields["P3_008N"]])

        censusNameMap[GEO_ID]["properties"]["VAP_TOTAL_MIXED"] = censusNameMap[GEO_ID]["properties"]["VAP_TOTAL_POP"] - censusNameMap[GEO_ID]["properties"]["VAP_TOTAL_ONE_RACE"]
        
    for i in range(1, len(rowsHispanic)):
        rowHispanic = rowsHispanic[i]
        GEO_ID = rowHispanic[dictFields["GEO_ID"]].split("US")[1]

        censusNameMap[GEO_ID]["properties"]["VAP_TOTAL_HISPANIC"] = int(rowHispanic[dictFieldsHispanic["P4_002N"]])
        # print(GEO_ID, censusNameMap[GEO_ID])

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
    with open("../cvapData/" + state[0] + "_block_added_vap.json", 'w') as outfile:
        json.dump(geojson, outfile)
    
    print(state)