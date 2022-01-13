import json
from os import listdir
from gerrychain import Graph
import geopandas as gpd

states = ["az"] # "nv", "ga", 
for state in states:
    onlyfiles = listdir("/Users/school/Desktop/databaseParsing/" + state + "/censusBlocks/")
    for file in onlyfiles:
        if "graph" in file:
            continue
        if ".json" not in file:
            continue
        print(file)
        with open("/Users/school/Desktop/databaseParsing/" + state + "/censusBlocks/" + file) as g:
            blocksForDistricting = json.load(g)
        # print(blocksForDistricting)
        districtsMap = {}
        for block in blocksForDistricting["features"]:
            if block["properties"]["District"] not in districtsMap:
                districtsMap[block["properties"]["District"]] = {"type": "FeatureCollection", "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:EPSG::4269"}}, "features": []}
            districtsMap[block["properties"]["District"]]["features"].append(block)
        
        districtingName = file.split("-")[0]
        for district in districtsMap:
            df = gpd.GeoDataFrame.from_features(districtsMap[district]["features"], crs="urn:ogc:def:crs:EPSG::4269")
            df.to_crs(inplace=True, crs="epsg:26918")
            dual_graph = Graph.from_geodataframe(df, ignore_errors=True, cols_to_add=["GEOID20"])

            boundaryNodeMap = {}
            for node in dual_graph.nodes:
                boundaryNode = dual_graph.nodes[node]["boundary_node"]
                GEOID20 = dual_graph.nodes[node]["GEOID20"]
                boundaryNodeMap[GEOID20] = boundaryNode
            districtsMap[district] = boundaryNodeMap

        with open("/Users/school/Desktop/databaseParsing/" + state + "/censusBlocks/" + districtingName + "-censusBlocks-graph.json") as g:
            blocksGraph = json.load(g)
        for node in blocksGraph["nodes"]:
            node["boundary_node"] = districtsMap[node["District"]][node["GEOID20"]]
        with open("/Users/school/Desktop/databaseParsing/" + state + "/censusBlocks/" + districtingName + "-censusBlocks-graph.json", 'w') as outfile:
            json.dump(blocksGraph, outfile)
        print("done", state, "districting", districtingName)