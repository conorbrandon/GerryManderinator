# 🐝 Hornets 🐝

## Gerrychain
https://gerrychain.readthedocs.io/en/latest/, for making a graph from geoJson. Will also be used for MGGG algorithm.

## What on earth is data/electionData and data/geoData and data/censusData and cleanData?
For frontend/backend stuff, cleanData should be enough. This will eventually contain three or more folders for the states with each folder containing an 'election' file that will contain some custom fields described in the README in that folder. We will translate these custom fields to our server and database design, and will also presumably be used in the Mapbox GeoJson api to help display information on and about the map.

On the other hand, geoData is designed for the Seawulf. It may contain some of the exact same files as electionData, but will also contain some custom graph json files and anything else needed for the Seawulf. Conor's thinking on this is to make it easy to transfer this folder as a tar to the Seawulf.

Because I'm a freak and like folders, there's also a folder for electionData and censusData.

If this two folder structure proves silly, we can definitely consolidate the two into one folder.

## GeoJson, shapefiles, and other potentially large data
Some of the files are too large to be pushed to github. See the gitignore for the ignored files and this Google Drive Link for the full (extremely messy) data and cleanData folders: https://drive.google.com/drive/u/0/folders/1nTFamE6NyfGvCo4iNbGoTmhMtGyByQwl.

There is an issue, though. The data and cleanData folders are syncing to drive directly from Conor's computer, so please don't put any new data in those folders on Drive, otherwise my laptop may get messed up.

_IMPORTANT note about data_
If you find new data, please put it in a subdirectory of either electionData or geoData or censusData. The gitignore is set up to ignore large files placed in directories following the pattern `geoData/*/*` and `electionData/*/*` and `censusData/*/*`. Make sure if you commit they will not be committed.

## Data sources
- https://dataverse.harvard.edu/dataverse/electionscience
- http://www.electproject.org/home/voter-turnout/voter-turnout-data
- https://electionlab.mit.edu/
- https://cdmaps.polisci.ucla.edu Congressional Districts
- http://www.brianamos.com/vest/documentation2016.txt
- https://www.census.gov/library/reference/code-lists/ansi/ansi-codes-for-states.html FIPS codes, good for IDs?
- https://github.com/orgs/mggg-states/repositories?page=1
- CENSUS :))
	- https://data.census.gov/cedsci/table?g=0400000US32%24100000&y=2020&d=DEC%20Redistricting%20Data%20%28PL%2094-171%29&tid=DECENNIALPL2020.P1&hidePreview=true
	- https://www.census.gov/programs-surveys/decennial-census/about/rdo/summary-files.html#P1
- https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/PSKDUJ
	- House precincts 2016 data
- https://azsos.gov/2020-election-information
	- House precincts 2020 arizona data
- https://results.enr.clarityelections.com/GA/105369/web.264614/#/access-to-races
	- House precincts 2020 georgia data
- https://www.nvsos.gov/sos/elections/election-information/precinct-level-results
	- House precincts 2020 nevada data
- Voter Registration
	- https://www.nvsos.gov/sos/elections/voters/2020-statistics/-fsiteid-1
	- https://azsos.gov/sites/default/files/State_Voter_Registration_2020_General.pdf
	- https://results.enr.clarityelections.com/GA/103613/web.255599/#/summary?voteType=All&precinct=All&party=All
	- https://sos.ga.gov/index.php/Elections/voter_registration_statistics
- Race percent breakdown
	- https://www.census.gov/quickfacts/fact/table/NV/RHI725219#RHI725219
- CVAP
	- https://www.census.gov/programs-surveys/decennial-census/about/voting-rights/cvap.2019.html

## Just for kicks geojson on Google Maps
https://jsfiddle.net/vy2txdkq/5/

## Requirements
- Java 16+ (may need to increase JVM ram)

## How to run
- Clone this repository
- Download the Census block information from: https://drive.google.com/drive/folders/1V6wtU4zegQKXlB13EUuYZZOaJw107OWg?usp=sharing 
- Place each of the 3 `.json` files from each directory in thier respective directory in `Spring/src/main/resources/db-load/`
- Open 2 terminal windows at the `Spring` folder
- Install mapshaper globally with `npm install -g mapshaper`
- Clean the directory with: `./mvnw clean`
- Install the packages with: `npm install`
- Run the webpack with: `npm run-script watch`
- To start the server type in the second terminal window: `./mvnw spring-boot:run`
- If you want to up the JVM ram (to 8gb) just for this run, instead type: `./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="-Xms4096m -Xmx8192m"`
- Finally open a web browser and go to http://localhost:8080/#
