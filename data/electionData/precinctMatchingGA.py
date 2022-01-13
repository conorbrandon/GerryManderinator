import json
from collections import Counter
import re

precinctSetElection = {}
with open('./georgia/2020/ga_2020_election.json') as f:
  dataElection = json.load(f)
for precinct in dataElection["features"]:
	if not precinct["properties"]["COUNTY"] in precinctSetElection:
		precinctSetElection[precinct["properties"]["COUNTY"]] = []
	precinctSetElection[precinct["properties"]["COUNTY"]].append(precinct["properties"]["PCTNUM"])

precinctSetHouse= {}
with open('./georgia/2020/ga_pr_house.json') as f:
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
	# print(county)
	# print(list(precinctSetElection[county]), len(precinctSetElection[county]))
	# print(list(precinctSetHouse[county]), len(precinctSetHouse[county]))
	for precinctHouse in precinctSetHouse[county]:
# 		precinctHouseDigits = ""
# 		for i in range(len(precinctHouse)):
# 			if precinctHouse[i].isdigit():
# 				precinctHouseDigits += precinctHouse[i]
# 		# print(precinctHouse, precinctHouseDigits)
		precinctMapHouse[county][precinctHouse] = "HELP"
		for precinctElec in precinctSetElection[county]:
			if precinctHouse == "05 Fire Station 1 (Statham)":
				precinctMapHouse[county][precinctHouse] = "05 FIRE STATION 1 (STATHAM)"
			elif re.match("^" + precinctHouse.upper() + "$", precinctElec) and not county == "Ware":
				# print(precinctHouse, precinctElec)
				precinctMapHouse[county][precinctHouse] = precinctElec
			elif re.match("^" + precinctHouse + "$", precinctElec):
				# print(precinctHouse, precinctElec)
				precinctMapHouse[county][precinctHouse] = precinctElec
# 			precinctElecDigits = ""
# 			for i in range(len(precinctElec)):
# 				if precinctElec[i].isdigit():
# 					precinctElecDigits += precinctElec[i]
# 			if re.match("^" + precinctHouseDigits + "$", precinctElecDigits):
# 				# print(precinctHouse, precinctElec)
# 				precinctMapHouse[county][precinctHouse] = precinctElec
# 			# elif re.match(precinctHouse.upper(), precinctElec[1]):
# 			# 		# print(precinctHouse, precinctElec)
# 			# 		precinctMapHouse[county][precinctHouse] = precinctElec
print(precinctMapHouse)
