import json

with open("./georgia/ga_block_with_pr_and_pop_and_hispanic.json") as f:
  dataPop = json.load(f)
with open("./georgia/ga_block_with_pr-wow.json") as f:
  dataBlock = json.load(f)
gaCounts = {
    "TOTAL_POP": 0,
    "TOTAL_ONE_RACE": 0,
    "TOTAL_ONE_WHITE": 0,
    "TOTAL_ONE_BLACK": 0,
    "TOTAL_ONE_INDIAN": 0,
    "TOTAL_ONE_ASIAN": 0,
    "TOTAL_ONE_PACIFIC": 0,
    "TOTAL_ONE_OTHER": 0,
    "TOTAL_HISPANIC": 0,
    "TOTAL_MIXED": 0
}
popMap = {}
for pop in dataPop["features"]:
    popGeoID = pop["properties"]["GEOID20"]
    popMap[popGeoID] = pop
count = 0
for block in range(len(dataBlock["features"])):
    blockGeoID = dataBlock["features"][block]["properties"]["GEOID20"]
    pop = popMap[blockGeoID]
    for field in pop["properties"]:
        if field in gaCounts:
            dataBlock["features"][block]["properties"][field] = pop["properties"][field]
    count += 1
    print(count, block)
with open("./georgia/ga_block_with_pr_and_pop-wow.json", 'w') as outfile:
    json.dump(dataBlock, outfile, indent=1)

# for block in dataPop["features"]:
#     for field in block["properties"]:
#         if field in gaCounts:
#           gaCounts[field] += block["properties"][field]
# print(gaCounts)