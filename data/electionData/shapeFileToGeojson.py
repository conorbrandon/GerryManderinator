import geopandas as gpd

file = gpd.read_file("../geoData/us-states/cb_2018_us_state_5m.shp")
file.to_file("../geoData/us-states/us-states.json", driver="GeoJSON")