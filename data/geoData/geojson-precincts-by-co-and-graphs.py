from gerrychain import Graph
import json
import geopandas as gpd
import matplotlib.pyplot as plt
import sys

# pass arizona, georgia, or nevada as argv[1]
state = str(sys.argv[1])
state_abbr = {"arizona": "az", "georgia": "ga", "nevada": "nv"}[state]

# read in the county file and make a graph from it
df = gpd.read_file("./{state}/{state_abbr}-co.json".format(state=state, state_abbr=state_abbr))
df.to_crs(inplace=True, crs="epsg:26918")
print(df)
dual_graph = Graph.from_geodataframe(df)

# if we want to relabel the nodes with the county name instead of int id, uncomment the following
# mapping = {}
for i in range(len(dual_graph.nodes())):
	# mapping[i] = dual_graph.nodes[i]["NAME"]
	print(dual_graph.nodes[i])

print(dual_graph, '\n\n')

# nx.relabel.relabel_nodes(dual_graph, mapping, copy=False)

# save the graph in a json file
dual_graph.to_json("./{state}/{state_abbr}-co-graph.json".format(state=state, state_abbr=state_abbr))

# save the graph figure for validation purposes
# nx.draw(dual_graph, with_labels=True, pos=nx.planar_layout(dual_graph))
# plt.savefig("./{state}/{state_abbr}-counties.png".format(state=state, state_abbr=state_abbr))

# iterate through precincts in precinct file and get the county names so they match the county file
counties = []
loaded = None
with open("./{state}/{state_abbr}-pr.json".format(state=state, state_abbr=state_abbr)) as json_file:
	loaded = json.load(json_file)
	# print(loaded["features"])
	for v in loaded["features"]:
		# print(v["properties"]["COUNTY"])
		counties.append(v["properties"]["COUNTY"])

# verify county names in precinct file are the same as county file
# mapping = list(set(mapping.values()))
# mapping.sort()
# print(mapping)
# counties = list(set(counties))
# counties.sort()
# print(counties)
# print(mapping == counties)
# for i in range(len(mapping)):
# 	if mapping[i] != counties[i]:
# 		print(mapping[i], counties[i])

# iterate through counties and add precincts for that county to a dictionary keyed by county
countySets = {}
for county in counties:
	countySets[county] = []
for v in loaded["features"]:
	countySets[v["properties"]["COUNTY"]].append(v)
# print(countySets)

# iterate through each county
for k, v in countySets.items():
	# set the features attribute in geojson object from from the precinct file to all precincts in each county
	loaded["features"] = v
	# dump this geojson
	with open("./{state}/counties/".format(state=state) + k + "-pr.json", 'w') as json_file:
		json.dump(loaded, json_file)
	
	# read in the geojson we just dumped and turn it into a graph
	df = gpd.read_file("./{state}/counties/".format(state=state) + k + "-pr.json")
	df.to_crs(inplace=True, crs="epsg:26918")
	co_graph = Graph.from_geodataframe(df, ignore_errors=True)
	print(k)
	print(df)
	
	# if k == "Carson City":	
	# 	# optionally relabel nodes
	# 	mapping = {}
	# 	for i in range(len(co_graph.nodes())):
	# 		mapping[i] = co_graph.nodes[i]["PCTNUM"]
	# 		# print(co_graph.nodes[i])
	# 	nx.relabel.relabel_nodes(co_graph, mapping, copy=False)
	# 	nx.draw(co_graph, with_labels=True, pos=nx.planar_layout(co_graph))
	# 	plt.savefig("./{state}/counties/".format(state=state) + k + "-precincts.png")
	# 	# print(mapping)
	# 	# print(k)
	# 	# for i in range(len(co_graph.nodes())):
	# 	# 	print(co_graph.nodes[i])

	# dump the graph json
	co_graph.to_json("./{state}/counties/".format(state=state) + k + "-pr-graph.json")