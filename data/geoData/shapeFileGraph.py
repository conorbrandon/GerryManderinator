from gerrychain import Graph
import json
import geopandas as gpd
import networkx as nx
import matplotlib.pyplot as plt

dual_graph = Graph.from_file("./PA/PA.shp")

dual_graph.to_json("./PA_graph.json")
nx.draw(dual_graph)
plt.savefig("./PA-precincts.png")
