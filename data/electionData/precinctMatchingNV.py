import json
from collections import Counter
import re

precinctSetElection = {}
with open('./nevada/2020/nv_2020_election.json') as f:
  dataElection = json.load(f)
for precinct in dataElection["features"]:
	if not precinct["properties"]["COUNTY"] in precinctSetElection:
		precinctSetElection[precinct["properties"]["COUNTY"]] = []
	precinctSetElection[precinct["properties"]["COUNTY"]].append(precinct["properties"]["PCTNUM"])

precinctSetHouse= {}
with open('./nevada/2020/nv_pr_house.json') as f:
  dataHouse = json.load(f)
for county, precincts in dataHouse.items():
	precinctSetHouse[county] = []
	for precinct in precincts:
		precinctSetHouse[county].append(precinct)

precinctMapHouse = {}
for county in dataHouse:
	precinctMapHouse[county] = {}	# House: Elec
# print(precinctMapHouse)

for county, precincts in dataHouse.items():
	# print(precinctSetElection[county], len(precinctSetElection[county]))
	# print(precinctSetHouse[county], len(precinctSetHouse[county]))
	# print()
	# print(county)
	for precinctHouse in precinctSetHouse[county]:
		precinctHouseDigits = ""
		for i in range(len(precinctHouse)):
			if precinctHouse[i].isdigit():
				precinctHouseDigits += precinctHouse[i]
		# print(precinctHouse, precinctHouseDigits)
		precinctMapHouse[county][precinctHouse] = "HELP"
		for precinctElec in precinctSetElection[county]:
			precinctElecDigits = ""
			for i in range(len(precinctElec)):
				if precinctElec[i].isdigit():
					precinctElecDigits += precinctElec[i]
				if county == "Elko" and len(precinctElecDigits) == 2:
					break
			if re.match("^" + precinctHouseDigits + "$", precinctElecDigits):
				# print(precinctHouse, precinctElec)
				precinctMapHouse[county][precinctHouse] = precinctElec
			# elif re.match(precinctHouse.upper(), precinctElec[1]):
			# 		# print(precinctHouse, precinctElec)
			# 		precinctMapHouse[county][precinctHouse] = precinctElec
print(precinctMapHouse)
