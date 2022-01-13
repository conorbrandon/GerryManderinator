# About the cleanData folder

For Chris, the most important files are the `{state}-districts.json`. For Kevin, essentially the other ones. I envision using the geojson `properties` field to do precinct colornig and other fun stuff.

Let's start with the easy stuff first:
1. `{state}-counties.json` is simply a geojson file of the counties in that state.
	- geojson properties fields
		1. `NAME`: name of the county
2. `{state}-districts.json` is a geojson file of the districts in that state.
	- geojson properties fields
		1. `STATENAME`: name of the state
		2. `DISTRICT`: district number (string, be advised)
3. `{state}_dist_elec_and_pop.json` is a regular json file of the districts in that state with census data and the result of the 2020 House election for each district AND `"state"` overall.
	- json object fields
		1. District number: all numbers are zero padded (ex: `"01"`) or `"state"`
			1. `TOTAL_POP`: population of the district
			2. `TOTAL_ONE_RACE:` total that reported only one race on the census
			3. `TOTAL_ONE_{race}`: total that reported only that race on the census
			4. `TOTAL_TWO_RACES:` total that reported only two races on the census
			5. `TOTAL_TWO_{race1}_{race2}`: total that reported race1 and race2 on the census
			6. `2020_HOUSE_RESULT`: which party won the 2020 house election for that district
				- will be either `"red"` or `"blue"`
				- If we want vote totals for each party, I can aggregate those up from the precinct level as well

Ok, the precinct level data is a beast. Precinct level data for each state is in `{state}_2020_election.json`. The fields between them might vary a little, but I've injected our custom fields into each precinct object under the geojson properties for that precinct (in theory). 

For some precincts, they might be missing some fields. This is because the data is messy and imperfect, so if things are breaking, check if the property you are looking for is `undefined` in the object (i.e. missing). You could inspect the objects, to see if they came packaged with the information you need, hence why I haven't stripped any of it out (it may come in handy). For example, I know for a fact some precincts in Nevada were not in the data sources I found, so they might be missing their `District` field. Nevada luckily came with a pre-packaged `VTDST` field, so that might work, it'll just be in a different format to my `District` field.

So, these are the ones we care about:
1. `COUNTY`: the county the precinct is in. I've used this a lot so I'm almost certain this can be relied on to exist and be correct.
	- ex: Maricopa
2. `PCTNUM`: precinct number or name. All of the precincts have this, and I'm pretty sure it's good data.
3. Vote totals for certain elections:
	- these all follow a similar format, see http://www.brianamos.com/vest/documentation2016.txt for more details. They all follow the same format, except the House elections. I didn't remember to grab candidate name, so they're all just `XXX`.
4. `PreColor`: color the precinct should be colored according to who it voted for in the 2020 Presidential Election.
5. `USSColor`: color the precinct should be colored according to who it voted for in the 2020 Senate Election (IF IT WAS BEING HELD).
6. `ATGColor`: color the precinct should be colored according to who it voted for in the 2020 Attorney General Election (IF IT WAS BEING HELD).
7. `HOUColor`: color the precinct should be colored according to who it voted for in the 2020 US House Election.
	- _NOTE about colors_:
		- `"red"`: republican won
		- `"blue"`: democrat won
		- `"gray"`: tied
		- `"transparent"`: election was not being held in 2020 (most senate races are these)
8. `overallD`: number of democratic votes received by all Democratic candidates for any election.
9. `overallR`: number of democratic votes received by all Republican candidates for any election.
10. `overallPartyPreference`: whichever `overall[D or R]` was greater (either `"R"` or `"D"`)
11. `District`: which congressional district this precinct is in (may be missing for reasons described above)
12. `census`: an object with all the census info described above for the districts, just for the precinct level (except obviously `2020_HOUSE_RESULT`)
