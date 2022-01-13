import re
import xml.etree.ElementTree as ET

counties = []
value = {}
countyWorkbooks = {}

tree = ET.parse("./arizona/2020/arizona_results_2020.xml")
root = tree.getroot()
for child in root:
	if child.tag == "electionInformation":
		continue
	elif child.tag == "voterTurnout":
		for jurisdiction in child[0]:
			if jurisdiction.attrib["name"] != "State":
				counties.append(jurisdiction.attrib["name"])
		value = {}
		countyWorkbooks = {key: dict(value) for key in counties}
	else:
		for contest in child:
			if re.search("Representative in Congress", contest.attrib["contestLongName"]):
				for choices in contest:
					if choices.tag == "choices":
						for choice in choices:
							print(choice.attrib["party"], contest.attrib["contestLongName"])
							if (choice.attrib["party"] == "DEM" or choice.attrib["party"] == "REP") and choice.attrib["isWriteIn"] == "false":
								party = choice.attrib["party"][0]
								for jurisdictions in choice:
									for jurisdiction in jurisdictions:
										if jurisdiction.attrib["name"] != "State":
											for precincts in jurisdiction:
												if precincts.tag != "voteTypes":
													for precinct in precincts:
														# print(jurisdiction.attrib["name"], precinct.attrib["name"], precinct.attrib["votes"])
														if precinct.attrib["name"] not in countyWorkbooks[jurisdiction.attrib["name"]]:
															countyWorkbooks[jurisdiction.attrib["name"]][precinct.attrib["name"]] = {"D": 0, "R": 0, "District": contest.attrib["contestLongName"].split("No. ")[1]}
														countyWorkbooks[jurisdiction.attrib["name"]][precinct.attrib["name"]][party] = precinct.attrib["votes"]
						print()
	# print(child.tag)
print(countyWorkbooks)
