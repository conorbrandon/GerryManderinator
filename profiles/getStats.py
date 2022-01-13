import os
import json

for state in ["az", "ga", "nv"]:
    totalSeconds = 0
    functionMap = {}
    count = 0
    for profile in os.listdir(state):
        counted = False
        profileFile = open(state + '/' + profile, 'r')
        for line in profileFile:
            if not counted:
                counted = True
                count += 1
            if 'function' in line:
                seconds = line.split('in ')[1].split(" ")[0]
                totalSeconds += float(seconds)
            else:
                stack = 'Gerry' + line.split('Gerry')[1][: -1]
                # print(stack)
                cumtime = line.strip().split()[3]
                # print(cumtime)
                if stack not in functionMap:
                    functionMap[stack] = 0
                functionMap[stack] += float(cumtime)
    averageSeconds = totalSeconds / count
    print("averageSeconds", averageSeconds)
    for k, v in functionMap.items():
        functionMap[k] = v / count
    print(functionMap)
    functionMap['averageSeconds'] = averageSeconds
    with open(state + '.json', 'w') as outfile:
        json.dump(functionMap, outfile)