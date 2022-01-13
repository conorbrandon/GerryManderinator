import json
from collections import Counter
import re

precinctSetElection = {}
with open('./arizona/2020/az_2020_election.json') as f:
  dataElection = json.load(f)
for precinct in dataElection["features"]:
	if not precinct["properties"]["COUNTY"] in precinctSetElection:
		precinctSetElection[precinct["properties"]["COUNTY"]] = []
	precinctSetElection[precinct["properties"]["COUNTY"]].append([precinct["properties"]["PCTNUM"], precinct["properties"]["PRECINCTNA"]])
# print(precinctSetElection["Gila"], len(precinctSetElection["Gila"]))

precinctSetHouse= {}
with open('./arizona/2020/az_pr_house.json') as f:
  dataHouse = json.load(f)
for county, precincts in dataHouse.items():
	precinctSetHouse[county] = []
	for precinct in precincts:
		precinctSetHouse[county].append(precinct)
# print(precinctSetHouse["Gila"], len(precinctSetHouse["Gila"]))

precinctMapHouse = {}
for county in dataHouse:
	precinctMapHouse[county] = {}	# House: Elec
# print(precinctMapHouse)

countyShortCodes = {
    "Apache": "AP",
    "Cochise": "CH",
    "Coconino": "CN",
    "Gila": "GI",
    "Graham": "GM",
    "La Paz": "LP",
    "Mohave": "MO",
    "Pinal": "PN",
    "Santa Cruz": "SC",
    "Yavapai": "YA",
    "Navajo": "NA",
    "Yuma": "YU",
    "Maricopa": "MC",
    "Pima": "PM",
    "Greenlee": "GN",
}

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
		
		if precinctHouseDigits != "":
			precinctHouseDigits = format(int(precinctHouseDigits), "04d")
			precinctHouseDigits = countyShortCodes[county] + precinctHouseDigits
		# print(precinctHouse, precinctHouseDigits)
		# match = False
		precinctMapHouse[county][precinctHouse] = "HELP"
		for precinctElec in precinctSetElection[county]:
			if re.match("^" + precinctHouseDigits + "$", precinctElec[0]):
				# print(precinctHouse, precinctElec)
				# match = True
				precinctMapHouse[county][precinctHouse] = precinctElec
			elif re.match(precinctHouse.upper(), precinctElec[1]):
					# print(precinctHouse, precinctElec)
					# match = True
					precinctMapHouse[county][precinctHouse] = precinctElec
			# if precinctHouse == "0605 SMP 1":
			# 	print(precinctHouse.upper(), precinctElec, re.match("^" + precinctHouse.upper() + "$", precinctElec[1]))
		# if not match:
		# 	print(precinctHouse.upper(), "HELP")
print(precinctMapHouse)

def Convert(string):
    list1=[]
    list1[:0]=string
    return list1


# for county, precincts in dataHouse.items():
# 	# print(precinctSetElection[county], len(precinctSetElection[county]))
# 	# print(precinctSetHouse[county], len(precinctSetHouse[county]))
# 	# print()
# 	# print(county)
# 	for precinctHouse in precinctSetHouse[county]:
# 		bestMatch = None
# 		bestMatchN = 0
# 		precinctHouseCopy = precinctHouse
# 		precinctHouse = Convert(precinctHouse)
# 		precinctHouse = Counter(precinctHouse)
# 		# print(precinctHouse)
# 		for precinctElec in precinctSetElection[county]:
# 			precinctElecCopy = precinctElec
# 			precinctElec= " ".join(precinctElec)
# 			precinctElec = Convert(precinctElec)
# 			precinctElec = Counter(precinctElec)
# 			# print(precinctElec)
# 			intersection = precinctHouse & precinctElec
# 			# print(intersection, len(intersection))
# 			if len(intersection) > bestMatchN:
# 				bestMatchN = len(intersection)
# 				bestMatch = precinctElecCopy
# 		# print(precinctHouseCopy, bestMatch)
# 		precinctMapHouse[county][precinctHouseCopy] = bestMatch
# print(precinctMapHouse)








# def lookForElectionFeature(COUNTY, PRECINCTNA, info, pctnum=False):
# 	if pctnum:
# 		lookingForProp = "PCTNUM"
# 		lookingFor = pctnum
# 	else:
# 		lookingForProp = "PRECINCTNA"
# 		lookingFor = PRECINCTNA
# 		print("using precincta")
# 	found = False
# 	dem = int(info["D"])
# 	rep = int(info["R"])
# 	dist = format(int(info["District"]), "02d")
# 	for precinct in dataElection["features"]:
# 		if precinct["properties"]["COUNTY"] == COUNTY:
# 			print(precinct["properties"][lookingForProp])
# 		if precinct["properties"]["COUNTY"] == COUNTY and precinct["properties"][lookingForProp] == lookingFor:
# 			found = True
# 			precinct["properties"]["G20H" + dist + "DXXX"] = dem
# 			precinct["properties"]["G20H" + dist + "RXXX"] = rep
# 			break
# 	if not found:
# 		print(COUNTY, PRECINCTNA, info, pctnum)
# 	return found
	

# for county, precincts in dataHouse.items():
# 	for precinct in precincts:
		# if county == "Apache": # good
		# 	pctnum = "AP00" + precinct[0:2]
		# 	res = lookForElectionFeature(county, None, dataHouse[county][precinct], pctnum)
		# 	# print(res)
		# if county == "Cochise": # good
		# 	pctnum = "CH00" + precinct[0:2]
		# 	res = lookForElectionFeature(county, None, dataHouse[county][precinct], pctnum)
		# 	# print(res)
		# if county == "Coconino": # good
		# 	pctnum = "CN00" + format(int(precinct.split(" ")[len(precinct.split(" ")) - 1]), "02d")
		# 	res = lookForElectionFeature(county, None, dataHouse[county][precinct], pctnum)
		# 	# print(res)
		# if county == "Coconino":
		# 	precincta = precinct + "".upper()
		# 	res = lookForElectionFeature(county, precincta, dataHouse[county][precinct])
		# 	print(res)