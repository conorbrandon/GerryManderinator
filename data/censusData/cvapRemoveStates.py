import csv

# csv file name
filename = "./cvapBgStates.csv"

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
print(dictFields)

blockGeoIDMap = {}
for i in range(0, len(rows)):
    row = rows[i]
    if row[dictFields["geoid"]] not in blockGeoIDMap:
        blockGeoIDMap[row[dictFields["geoid"]]] = {}
    blockGeoIDMap[row[dictFields["geoid"]]]["geoname"] = row[dictFields["geoname"]]
    blockGeoIDMap[row[dictFields["geoid"]]][row[dictFields["lntitle"]]] = row[dictFields["cvap_est"]]
# print(blockGeoIDMap)
lines = ["geoid,total,hispanic,white,black,indian,asian,pacific\n"]
for blockGroup in blockGeoIDMap:
    lineStr = blockGroup.split("15000US")[1] + ","
    lineStr += blockGeoIDMap[blockGroup]["Total"] + ","
    lineStr += blockGeoIDMap[blockGroup]["Hispanic or Latino"] + ","
    lineStr += blockGeoIDMap[blockGroup]["White Alone"] + ","
    lineStr += blockGeoIDMap[blockGroup]["Black or African American Alone"] + ","
    lineStr += blockGeoIDMap[blockGroup]["American Indian or Alaska Native Alone"] + ","
    lineStr += blockGeoIDMap[blockGroup]["Asian Alone"] + ","
    lineStr += blockGeoIDMap[blockGroup]["Native Hawaiian or Other Pacific Islander Alone"] + "\n"
    lines.append(lineStr)

f = open("./cvapBgParsed.csv", "w")
f.write(''.join(lines))
f.close()

# cvapAllStates = open("./cvapBlockGroups.csv", encoding='latin-1')

# linesWeWant = []
# gotHeader = False
# for line in cvapAllStates:
#     if not gotHeader:
#         linesWeWant.append(line)
#         gotHeader = True
#     if "Arizona" in line or "Georgia" in line or "Nevada" in line:
#         linesWeWant.append(line)

# f = open("./cvapBgStates.csv", "w")
# f.write(''.join(linesWeWant))
# f.close()