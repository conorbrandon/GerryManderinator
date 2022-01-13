# house_csv = open("./arizona/az-2016-precinct-house.csv")
# mapping = {'Maricopa': set(), 'Santa Cruz': set(), 'Yuma': set(), 'Pima': set(), 'Greenlee': set(), 'Pinal': set(), 'Gila': set(), 'Apache': set(), 'La Paz': set(), 'Navajo': set(), 'Mohave': set(), 'Yavapai': set(), 'Graham': set(), 'Cochise': set(), 'Coconino': set()}
# cos = set()

# i = 0
# for line in house_csv:
# 	if not i:
# 		i += 1
# 		continue
# 	co = line.split(",")[12]
# 	pr = line.split(",")[13]
# 	co = co.replace('"', '')
# 	pr = pr.replace('"', '')
# 	mapping[co].add(pr)
# 	cos.add(co)

# house_csv.close()
# # print()
# for county, v in mapping.items():
# 	keys = list(mapping[county])
# 	value = {"D": 0, "R": 0, "Dist": 0}
# 	mapping[county] = {key: dict(value) for key in keys}
# # print(mapping)

# house_csv = open("./arizona/az-2016-precinct-house.csv")
# i = 0
# for line in house_csv:
# 	if not i:
# 		i += 1
# 		continue
# 	co = line.split(",")[12]
# 	pr = line.split(",")[13]
# 	co = co.replace('"', '')
# 	pr = pr.replace('"', '')
# 	dist = line.split(",")[17]
# 	if dist == 'NA':
# 		continue
# 	dist = int(dist)
# 	party = line.split(",")[19]
# 	party = party.replace('"', '')
# 	votes = int(line.split(",")[21])
# 	# print(co, pr, dist, party, votes, mapping[co][pr])
# 	if party == "democratic":
# 		# print(dist, party, votes)
# 		mapping[co][pr]["D"] += votes
# 		mapping[co][pr]["Dist"] = dist
# 	if party == "republican":
# 		# print(dist, party, votes)
# 		mapping[co][pr]["R"] += votes
# 		mapping[co][pr]["Dist"] = dist
# print(mapping)

###############################

# house_csv = open("./nevada/nv-2016-precinct-house.csv")
# mapping = {'Washoe': set(), 'White Pine': set(), 'Elko': set(), 'Carson City': set(), 'Eureka': set(), 'Esmeralda': set(), 'Pershing': set(), 'Mineral': set(), 'Douglas': set(), 'Churchill': set(), 'Humboldt': set(), 'Clark': set(), 'Lincoln': set(), 'Lyon': set(), 'Lander': set(), 'Nye': set(), 'Storey': set()}
# cos = set()

# i = 0
# for line in house_csv:
# 	if not i:
# 		i += 1
# 		continue
# 	co = line.split(",")[12]
# 	pr = line.split(",")[13]
# 	co = co.replace('"', '')
# 	pr = pr.replace('"', '')
# 	mapping[co].add(pr)
# 	cos.add(co)

# house_csv.close()
# # print()
# for county, v in mapping.items():
# 	keys = list(mapping[county])
# 	value = {"D": 0, "R": 0, "Dist": 0}
# 	mapping[county] = {key: dict(value) for key in keys}
# # print(mapping)

# house_csv = open("./nevada/nv-2016-precinct-house.csv")
# i = 0
# for line in house_csv:
# 	if not i:
# 		i += 1
# 		continue
# 	co = line.split(",")[12]
# 	pr = line.split(",")[13]
# 	co = co.replace('"', '')
# 	pr = pr.replace('"', '')
# 	dist = line.split(",")[18]	# because candidate has last, first
# 	if dist == 'NA':
# 		continue
# 	dist = int(dist)
# 	party = line.split(",")[20]
# 	party = party.replace('"', '')
# 	votes = int(line.split(",")[22])
# 	# print(co, pr, dist, party, votes, mapping[co][pr])
# 	if party == "democratic":
# 		# print(dist, party, votes)
# 		mapping[co][pr]["D"] += votes
# 		mapping[co][pr]["Dist"] = dist
# 	if party == "republican":
# 		# print(dist, party, votes)
# 		mapping[co][pr]["R"] += votes
# 		mapping[co][pr]["Dist"] = dist
# print(mapping)

###############################

house_csv = open("./georgia/ga-2016-precinct-house.csv")
mapping = {'Wilkes': set(), 'Gwinnett': set(), 'Camden': set(), 'Whitfield': set(), 'Fannin': set(), 'Berrien': set(), 'Floyd': set(), 'Franklin': set(), 'Schley': set(), 'Madison': set(), 'Muscogee': set(), 'Wheeler': set(), 'Walker': set(), 'Jackson': set(), 'Elbert': set(), 'Meriwether': set(), 'Tift': set(), 'Troup': set(), 'Liberty': set(), 'Bryan': set(), 'Pike': set(), 'Washington': set(), 'Habersham': set(), 'Harris': set(), 'Jones': set(), 'Brantley': set(), 'Miller': set(), 'Treutlen': set(), 'Houston': set(), 'Appling': set(), 'White': set(), 'Early': set(), 'Baker': set(), 'Webster': set(), 'Hart': set(), 'Carroll': set(), 'Atkinson': set(), 'Lincoln': set(), 'Terrell': set(), 'Crisp': set(), 'Macon': set(), 'Spalding': set(), 'Gilmer': set(), 'Calhoun': set(), 'Polk': set(), 'Lee': set(), 'Taylor': set(), 'Union': set(), 'Effingham': set(), 'Wilkinson': set(), 'Oconee': set(), 'Clinch': set(), 'Putnam': set(), 'Bibb': set(), 'Baldwin': set(), 'Banks': set(), 'Jenkins': set(), 'Cherokee': set(), 'Henry': set(), 'Fayette': set(), 'Wayne': set(), 'Laurens': set(), 'Hancock': set(), 'Douglas': set(), 'McIntosh': set(), 'Grady': set(), 'Tattnall': set(), 'Towns': set(), 'Bartow': set(), 'Burke': set(), 'Johnson': set(), 'Clay': set(), 'Stephens': set(), 'Peach': set(), 'Chatham': set(), 'Bacon': set(), 'Irwin': set(), 'Lowndes': set(), 'Forsyth': set(), 'Bleckley': set(), 'Talbot': set(), 'Morgan': set(), 'Coweta': set(), 'Barrow': set(), 'Gordon': set(), 'Jeff Davis': set(), 'Butts': set(), 'Glynn': set(), 'Pickens': set(), 'Lamar': set(), 'Colquitt': set(), 'Bulloch': set(), 'Charlton': set(), 'Thomas': set(), 'Jefferson': set(), 'Dooly': set(), 'Screven': set(), 'Glascock': set(), 'Rockdale': set(), 'DeKalb': set(), 'McDuffie': set(), 'Dade': set(), 'Haralson': set(), 'Columbia': set(), 'Oglethorpe': set(), 'Cobb': set(), 'Murray': set(), 'Sumter': set(), 'Dougherty': set(), 'Hall': set(), 'Greene': set(), 'Mitchell': set(), 'Turner': set(), 'Clayton': set(), 'Walton': set(), 'Wilcox': set(), 'Crawford': set(), 'Dodge': set(), 'Catoosa': set(), 'Marion': set(), 'Telfair': set(), 'Richmond': set(), 'Paulding': set(), 'Rabun': set(), 'Coffee': set(), 'Twiggs': set(), 'Upson': set(), 'Long': set(), 'Cook': set(), 'Lanier': set(), 'Ben Hill': set(), 'Toombs': set(), 'Emanuel': set(), 'Ware': set(), 'Chattahoochee': set(), 'Fulton': set(), 'Decatur': set(), 'Lumpkin': set(), 'Chattooga': set(), 'Montgomery': set(), 'Warren': set(), 'Clarke': set(), 'Seminole': set(), 'Candler': set(), 'Jasper': set(), 'Pulaski': set(), 'Randolph': set(), 'Dawson': set(), 'Evans': set(), 'Pierce': set(), 'Quitman': set(), 'Taliaferro': set(), 'Brooks': set(), 'Echols': set(), 'Stewart': set(), 'Worth': set(), 'Newton': set(), 'Heard': set(), 'Monroe': set(),}
cos = set()

i = 0
for line in house_csv:
	if not i:
		i += 1
		continue
	co = line.split(",")[12]
	pr = line.split(",")[13]
	co = co.replace('"', '')
	pr = pr.replace('"', '')
	mapping[co].add(pr)
	cos.add(co)

house_csv.close()
# print()
for county, v in mapping.items():
	keys = list(mapping[county])
	value = {"D": 0, "R": 0, "Dist": 0}
	mapping[county] = {key: dict(value) for key in keys}
# print(mapping)

house_csv = open("./georgia/ga-2016-precinct-house.csv")
i = 0
for line in house_csv:
	if not i:
		i += 1
		continue
	co = line.split(",")[12]
	pr = line.split(",")[13]
	co = co.replace('"', '')
	pr = pr.replace('"', '')
	dist = line.split(",")[17]
	if dist == 'NA':
		continue
	dist = int(dist)
	party = line.split(",")[19]
	party = party.replace('"', '')
	votes = int(line.split(",")[21])
	print(co, pr, dist, party, votes, mapping[co][pr])
	if party == "democratic":
		# print(dist, party, votes)
		mapping[co][pr]["D"] += votes
		mapping[co][pr]["Dist"] = dist
	if party == "republican":
		# print(dist, party, votes)
		mapping[co][pr]["R"] += votes
		mapping[co][pr]["Dist"] = dist
print(mapping)