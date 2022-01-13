# importing csv module
import csv
import re

# csv file name
filename = "./nevada/2020/nevada_precincts_2020.csv"

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

countyMapping = {}
candidateMap = {
    "Amodei, Mark E.": "R",
    "Rodimer, Dan \"Big Dan\"": "R",
    "Marchant, Jim": "R",
    "ACKERMAN, PATRICIA": "D",
    "TITUS, Dina": "D",
    "Horsford, Steven A.": "D",
    "LEE, SUZANNE": "D",
    "Bentley, Joyce": "R"
}

for row in rows:
	if row[dictFields['Jurisdiction']] in countyMapping:
		continue
	elif row[dictFields['Jurisdiction']] != '':
		countyMapping[row[dictFields['Jurisdiction']]] = {}
for row in rows:
	if row[dictFields['Precinct']] == '':
		continue
	if row[dictFields['Precinct']] in countyMapping[row[dictFields['Jurisdiction']]]:
		continue
	elif row[dictFields['Precinct']] != '':
		countyMapping[row[dictFields['Jurisdiction']]][row[dictFields['Precinct']]] = {"D": 0, "R": 0}
for row in rows:
	if row[dictFields['Jurisdiction']] == '' or row[dictFields['Precinct']] == '':
		continue
	if re.search("Representative in Congress", row[dictFields['Contest']]) and row[dictFields['Selection']] in candidateMap:
		countyMapping[row[dictFields['Jurisdiction']]][row[dictFields['Precinct']]]["District"] = row[dictFields['Contest']].split("Dist. ")[1]
		try:
			countyMapping[row[dictFields['Jurisdiction']]][row[dictFields['Precinct']]][candidateMap[row[dictFields['Selection']]]] += int(row[dictFields['Votes']])
		except:
			0
print(countyMapping)