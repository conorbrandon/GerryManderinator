from os import listdir
import pandas as pd
import re
import xml.etree.ElementTree as ET

counties = listdir("./georgia/2020/counties")
for i in range(len(counties)):
	counties[i] = counties[i].replace(".xml", "")
value = {}
countyWorkbooks = {key: dict(value) for key in counties}
for county in counties:
	if county != ".DS_Store":
		# print(county)
		tree = ET.parse("./georgia/2020/counties/" + county + ".xml")
		root = tree.getroot()
		tableOfContents = None
		for child in root:
			if not child.tag == "Contest":
				continue
			if not re.match("US House", child.attrib["text"]):
				continue
			# print(child.tag, child.attrib)
			district = child.attrib["text"].split(" ")[3]
			for precinct in child[0]:
				# print("HELP", precinct.attrib["name"])
				countyWorkbooks[county][precinct.attrib["name"]] = {"D": 0, "R": 0, "District": district}
				# print(int(district), county, precinct.attrib["name"])
			for child2 in child:
				if not child2.tag == "Choice":
					continue
				# print(child2.tag, child2.attrib)
				party = child2.attrib["text"].split("(")[len(child2.attrib["text"].split("(")) - 1][0]
				for child3 in child2:
					# print(child3.tag, child3.attrib)
					for child4 in child3:
						# print(child4.tag, child4.attrib, party)
						countyWorkbooks[county][child4.attrib["name"]][party] += int(child4.attrib["votes"])
print(countyWorkbooks)

# counties = listdir("./georgia/2020/counties")
# for county in counties:
# 	if county != ".DS_Store":
# 		excel = open("./georgia/2020/counties/" + county + "/detail.xml")
# 		out = open("./georgia/2020/counties/" + county + ".xml", "x")
# 		out.writelines(excel)