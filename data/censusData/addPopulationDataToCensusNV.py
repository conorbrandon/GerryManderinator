# importing csv module
import csv
import json
import re

# csv file name
filename = "./nevada/nv_block_data.csv"

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

districtCounts = {

}
precinctsMissingDist = set()

with open("../electionData/nevada/2020/nv_2020_election_house_fixed_2.json") as f:
  dataElection = json.load(f)
with open("./nevada/nv_block_with_pr.json") as f:
  dataCensus = json.load(f)

precinctNameMap = dict()
for precinctElec in dataElection["features"]:
	precinctNameMap[precinctElec["properties"]["PCTNUM"]] = precinctElec
blockNameMap = dict()
for i in range(1, len(rows)):
	row = rows[i]
	GEO_ID = row[dictFields["GEO_ID"]].split("US")[1]
	blockNameMap[GEO_ID] = row

for precinct in dataElection["features"]:
	precinct["properties"]["census"] = {
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
			"TOTAL_TWO_PACIFIC_OTHER": 0
		}

count = 0
for precinct in dataCensus["features"]:
	precinctGEO_ID = precinct["properties"]["GEOID20"]
	PCTNUM = precinct["properties"]["PCTNUM"]
	# for i in range(1, len(rows)):
	if True:
		# row = rows[i]
		row = blockNameMap[precinctGEO_ID]
		GEO_ID = row[dictFields["GEO_ID"]]
		# if not re.search(precinctGEO_ID, GEO_ID):
		# 	continue
		# else:
		# 	count += 1
		# 	print("COUNT", count, precinctGEO_ID, GEO_ID, PCTNUM)
		count += 1
		print("COUNT", count, precinctGEO_ID, GEO_ID, PCTNUM)
		TOTAL_POP = int(row[dictFields["P1_001N"]])
		TOTAL_ONE_RACE = int(row[dictFields["P1_002N"]])
		TOTAL_ONE_WHITE = int(row[dictFields["P1_003N"]])
		TOTAL_ONE_BLACK = int(row[dictFields["P1_004N"]])
		TOTAL_ONE_INDIAN = int(row[dictFields["P1_005N"]])
		TOTAL_ONE_ASIAN = int(row[dictFields["P1_006N"]])
		TOTAL_ONE_PACIFIC = int(row[dictFields["P1_007N"]])
		TOTAL_ONE_OTHER = int(row[dictFields["P1_008N"]])
		TOTAL_TWO = int(row[dictFields["P1_010N"]])
		TOTAL_TWO_WHITE_BLACK = int(row[dictFields["P1_011N"]])
		TOTAL_TWO_WHITE_INDIAN = int(row[dictFields["P1_012N"]])
		TOTAL_TWO_WHITE_ASIAN = int(row[dictFields["P1_013N"]])
		TOTAL_TWO_WHITE_PACIFIC = int(row[dictFields["P1_014N"]])
		TOTAL_TWO_WHITE_OTHER = int(row[dictFields["P1_015N"]])
		TOTAL_TWO_BLACK_INDIAN = int(row[dictFields["P1_016N"]])
		TOTAL_TWO_BLACK_ASIAN = int(row[dictFields["P1_017N"]])
		TOTAL_TWO_BLACK_PACIFIC = int(row[dictFields["P1_018N"]])
		TOTAL_TWO_BLACK_OTHER = int(row[dictFields["P1_019N"]])
		TOTAL_TWO_INDIAN_ASIAN = int(row[dictFields["P1_020N"]])
		TOTAL_TWO_INDIAN_PACIFIC = int(row[dictFields["P1_021N"]])
		TOTAL_TWO_INDIAN_OTHER = int(row[dictFields["P1_022N"]])
		TOTAL_TWO_ASIAN_PACIFIC = int(row[dictFields["P1_023N"]])
		TOTAL_TWO_ASIAN_OTHER = int(row[dictFields["P1_024N"]])
		TOTAL_TWO_PACIFIC_OTHER = int(row[dictFields["P1_025N"]])
		precinct["properties"]["census"] = {
			"TOTAL_POP": TOTAL_POP,
			"TOTAL_ONE_RACE": TOTAL_ONE_RACE,
			"TOTAL_ONE_WHITE": TOTAL_ONE_WHITE,
			"TOTAL_ONE_BLACK": TOTAL_ONE_BLACK,
			"TOTAL_ONE_INDIAN": TOTAL_ONE_INDIAN,
			"TOTAL_ONE_ASIAN": TOTAL_ONE_ASIAN,
			"TOTAL_ONE_PACIFIC": TOTAL_ONE_PACIFIC,
			"TOTAL_ONE_OTHER": TOTAL_ONE_OTHER,
			"TOTAL_TWO_RACES": TOTAL_TWO,
			"TOTAL_TWO_WHITE_BLACK": TOTAL_TWO_WHITE_BLACK,
			"TOTAL_TWO_WHITE_INDIAN": TOTAL_TWO_WHITE_INDIAN,
			"TOTAL_TWO_WHITE_ASIAN": TOTAL_TWO_WHITE_ASIAN,
			"TOTAL_TWO_WHITE_PACIFIC": TOTAL_TWO_WHITE_PACIFIC,
			"TOTAL_TWO_WHITE_OTHER": TOTAL_TWO_WHITE_OTHER,
			"TOTAL_TWO_BLACK_INDIAN": TOTAL_TWO_BLACK_INDIAN,
			"TOTAL_TWO_BLACK_ASIAN": TOTAL_TWO_BLACK_ASIAN,
			"TOTAL_TWO_BLACK_PACIFIC": TOTAL_TWO_BLACK_PACIFIC,
			"TOTAL_TWO_BLACK_OTHER": TOTAL_TWO_BLACK_OTHER,
			"TOTAL_TWO_INDIAN_ASIAN": TOTAL_TWO_INDIAN_ASIAN,
			"TOTAL_TWO_INDIAN_PACIFIC": TOTAL_TWO_INDIAN_PACIFIC,
			"TOTAL_TWO_INDIAN_OTHER": TOTAL_TWO_INDIAN_OTHER,
			"TOTAL_TWO_ASIAN_PACIFIC": TOTAL_TWO_ASIAN_PACIFIC,
			"TOTAL_TWO_ASIAN_OTHER": TOTAL_TWO_ASIAN_OTHER,
			"TOTAL_TWO_PACIFIC_OTHER": TOTAL_TWO_PACIFIC_OTHER
		}
		# print(precinct["properties"])
		# print()
		# for precinctElec in dataElection["features"]:
		if True:
			precinctElec = precinctNameMap[PCTNUM]
			if precinctElec["properties"]["PCTNUM"] == PCTNUM:
				precinctElec["properties"]["census"]["TOTAL_POP"] += TOTAL_POP
				precinctElec["properties"]["census"]["TOTAL_ONE_RACE"] += TOTAL_ONE_RACE
				precinctElec["properties"]["census"]["TOTAL_ONE_WHITE"] += TOTAL_ONE_WHITE
				precinctElec["properties"]["census"]["TOTAL_ONE_BLACK"] += TOTAL_ONE_BLACK
				precinctElec["properties"]["census"]["TOTAL_ONE_INDIAN"] += TOTAL_ONE_INDIAN
				precinctElec["properties"]["census"]["TOTAL_ONE_ASIAN"] += TOTAL_ONE_ASIAN
				precinctElec["properties"]["census"]["TOTAL_ONE_PACIFIC"] += TOTAL_ONE_PACIFIC
				precinctElec["properties"]["census"]["TOTAL_ONE_OTHER"] += TOTAL_ONE_OTHER
				precinctElec["properties"]["census"]["TOTAL_TWO_RACES"] += TOTAL_TWO
				precinctElec["properties"]["census"]["TOTAL_TWO_WHITE_BLACK"] += TOTAL_TWO_WHITE_BLACK
				precinctElec["properties"]["census"]["TOTAL_TWO_WHITE_INDIAN"] += TOTAL_TWO_WHITE_INDIAN
				precinctElec["properties"]["census"]["TOTAL_TWO_WHITE_ASIAN"] += TOTAL_TWO_WHITE_ASIAN
				precinctElec["properties"]["census"]["TOTAL_TWO_WHITE_PACIFIC"] += TOTAL_TWO_WHITE_PACIFIC
				precinctElec["properties"]["census"]["TOTAL_TWO_WHITE_OTHER"] += TOTAL_TWO_WHITE_OTHER
				precinctElec["properties"]["census"]["TOTAL_TWO_BLACK_INDIAN"] += TOTAL_TWO_BLACK_INDIAN
				precinctElec["properties"]["census"]["TOTAL_TWO_BLACK_ASIAN"] += TOTAL_TWO_BLACK_ASIAN
				precinctElec["properties"]["census"]["TOTAL_TWO_BLACK_PACIFIC"] += TOTAL_TWO_BLACK_PACIFIC
				precinctElec["properties"]["census"]["TOTAL_TWO_BLACK_OTHER"] += TOTAL_TWO_BLACK_OTHER
				precinctElec["properties"]["census"]["TOTAL_TWO_INDIAN_ASIAN"] += TOTAL_TWO_INDIAN_ASIAN
				precinctElec["properties"]["census"]["TOTAL_TWO_INDIAN_PACIFIC"] += TOTAL_TWO_INDIAN_PACIFIC
				precinctElec["properties"]["census"]["TOTAL_TWO_INDIAN_OTHER"] += TOTAL_TWO_INDIAN_OTHER
				precinctElec["properties"]["census"]["TOTAL_TWO_ASIAN_PACIFIC"] += TOTAL_TWO_ASIAN_PACIFIC
				precinctElec["properties"]["census"]["TOTAL_TWO_ASIAN_OTHER"] += TOTAL_TWO_ASIAN_OTHER
				precinctElec["properties"]["census"]["TOTAL_TWO_PACIFIC_OTHER"] += TOTAL_TWO_PACIFIC_OTHER
				if "District" not in precinctElec["properties"]:
					# print(precinctElec["properties"])
					precinctsMissingDist.add(precinctElec["properties"]["PCTNUM"])
					continue
				if precinctElec["properties"]["District"] in districtCounts:
					districtCounts[precinctElec["properties"]["District"]]
					districtCounts[precinctElec["properties"]["District"]]["TOTAL_POP"] += TOTAL_POP
					districtCounts[precinctElec["properties"]["District"]]["TOTAL_ONE_RACE"] += TOTAL_ONE_RACE
					districtCounts[precinctElec["properties"]["District"]]["TOTAL_ONE_WHITE"] += TOTAL_ONE_WHITE
					districtCounts[precinctElec["properties"]["District"]]["TOTAL_ONE_BLACK"] += TOTAL_ONE_BLACK
					districtCounts[precinctElec["properties"]["District"]]["TOTAL_ONE_INDIAN"] += TOTAL_ONE_INDIAN
					districtCounts[precinctElec["properties"]["District"]]["TOTAL_ONE_ASIAN"] += TOTAL_ONE_ASIAN
					districtCounts[precinctElec["properties"]["District"]]["TOTAL_ONE_PACIFIC"] += TOTAL_ONE_PACIFIC
					districtCounts[precinctElec["properties"]["District"]]["TOTAL_ONE_OTHER"] += TOTAL_ONE_OTHER
					districtCounts[precinctElec["properties"]["District"]]["TOTAL_TWO_RACES"] += TOTAL_TWO
					districtCounts[precinctElec["properties"]["District"]]["TOTAL_TWO_WHITE_BLACK"] += TOTAL_TWO_WHITE_BLACK
					districtCounts[precinctElec["properties"]["District"]]["TOTAL_TWO_WHITE_INDIAN"] += TOTAL_TWO_WHITE_INDIAN
					districtCounts[precinctElec["properties"]["District"]]["TOTAL_TWO_WHITE_ASIAN"] += TOTAL_TWO_WHITE_ASIAN
					districtCounts[precinctElec["properties"]["District"]]["TOTAL_TWO_WHITE_PACIFIC"] += TOTAL_TWO_WHITE_PACIFIC
					districtCounts[precinctElec["properties"]["District"]]["TOTAL_TWO_WHITE_OTHER"] += TOTAL_TWO_WHITE_OTHER
					districtCounts[precinctElec["properties"]["District"]]["TOTAL_TWO_BLACK_INDIAN"] += TOTAL_TWO_BLACK_INDIAN
					districtCounts[precinctElec["properties"]["District"]]["TOTAL_TWO_BLACK_ASIAN"] += TOTAL_TWO_BLACK_ASIAN
					districtCounts[precinctElec["properties"]["District"]]["TOTAL_TWO_BLACK_PACIFIC"] += TOTAL_TWO_BLACK_PACIFIC
					districtCounts[precinctElec["properties"]["District"]]["TOTAL_TWO_BLACK_OTHER"] += TOTAL_TWO_BLACK_OTHER
					districtCounts[precinctElec["properties"]["District"]]["TOTAL_TWO_INDIAN_ASIAN"] += TOTAL_TWO_INDIAN_ASIAN
					districtCounts[precinctElec["properties"]["District"]]["TOTAL_TWO_INDIAN_PACIFIC"] += TOTAL_TWO_INDIAN_PACIFIC
					districtCounts[precinctElec["properties"]["District"]]["TOTAL_TWO_INDIAN_OTHER"] += TOTAL_TWO_INDIAN_OTHER
					districtCounts[precinctElec["properties"]["District"]]["TOTAL_TWO_ASIAN_PACIFIC"] += TOTAL_TWO_ASIAN_PACIFIC
					districtCounts[precinctElec["properties"]["District"]]["TOTAL_TWO_ASIAN_OTHER"] += TOTAL_TWO_ASIAN_OTHER
					districtCounts[precinctElec["properties"]["District"]]["TOTAL_TWO_PACIFIC_OTHER"] += TOTAL_TWO_PACIFIC_OTHER
				else:
					districtCounts[precinctElec["properties"]["District"]] = {
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
						"TOTAL_TWO_PACIFIC_OTHER": 0
					}
		print(precinctElec["properties"])
		print(districtCounts)

for precinctElec in dataElection["features"]:
	print(precinctElec["properties"])
	print()

print(districtCounts)
print(precinctsMissingDist)

with open("./nevada/nv_block_with_pr_and_pop.json", 'w') as outfile:
    json.dump(dataCensus, outfile, indent=1)
with open("./districts/nevada_dist_pop.json", 'w') as outfile:
    json.dump(districtCounts, outfile, indent=1)
with open("../electionData/nevada/2020/nv_2020_election_house_2_and_pop.json", 'w') as outfile:
    json.dump(dataElection, outfile, indent=1)