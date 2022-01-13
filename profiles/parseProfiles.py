import os

for state in ["az", "ga", "nv"]:
    for profile in os.listdir(state):
        profileFile = open(state + '/' + profile, 'r')
        keepLines = []
        for line in profileFile:
            if "Gerry" in line or "seconds" in line:
                keepLines.append(line)
        profileFile.close()
        print(keepLines, profile)
        profileFile = open(state + '/' + profile, 'w')
        for line in keepLines:
            profileFile.write(line)
        profileFile.close()