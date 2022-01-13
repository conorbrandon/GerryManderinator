from gerrychain import Graph
import geopandas as gpd
import sys

if len(sys.argv) != 2:
	print("provide the path of the json file you are trying to convert. It will be created alongside this file.")
	print("for example, ./arizona/az-pr.json path will create a graph ./arizona/az-pr-graph.json")
	exit(0)

graph_path = sys.argv[1].split(".json")[0] + "-graph.json"
print("File will be saved to: " + graph_path)

# read in the geojson file and make a graph from it
df = gpd.read_file(sys.argv[1])
df.to_crs(inplace=True, crs="EPSG:5070")
print(df.crs)
print(df)
dual_graph = Graph.from_geodataframe(df, ignore_errors=True, reproject=True)

# if we want to relabel the nodes with the county name instead of int id, uncomment the following
for i in range(len(dual_graph.nodes())):
	print(dual_graph.nodes[i])

print(dual_graph, '\n\n')

# save the graph in a json file
dual_graph.to_json(graph_path)